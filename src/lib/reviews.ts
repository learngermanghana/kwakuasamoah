import "server-only";

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  reviewText: string;
};

const REVIEWS_SHEET_CSV_URL =
  process.env.REVIEWS_SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeF3VLsI7UJ8lLcFgCGlAWOKGcAYS0sCXebnk0w61SN4uCGigdEZaHPXMaXs87vu4bSYETP9FOOKSz/pub?output=csv";
const REVIEWS_REVALIDATE_SECONDS = 60 * 60;
const REVIEWS_TIMEOUT_MS = 6_000;

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const nextCharacter = csv[index + 1];

    if (inQuotes) {
      if (character === '"' && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        value += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === ",") {
      row.push(value.trim());
      value = "";
    } else if (character === "\n") {
      row.push(value.trim());
      rows.push(row);
      row = [];
      value = "";
    } else if (character !== "\r") {
      value += character;
    }
  }

  row.push(value.trim());
  rows.push(row);

  return rows.filter((cells) => cells.some((cell) => cell.trim()));
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

function csvToObjects(csv: string) {
  const [headerRow, ...dataRows] = parseCsv(csv);
  if (!headerRow?.length) return [];

  const headers = headerRow.map(normalizeHeader);

  return dataRows.map((cells) =>
    headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = cells[index]?.trim() || "";
      return row;
    }, {})
  );
}

function pick(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = row[normalizeHeader(key)];
    if (value?.trim()) return value.trim();
  }
  return "";
}

function normalizeRating(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(5, Math.max(1, Math.round(parsed)));
}

function normalizeReview(row: Record<string, string>, index: number): ReviewItem | null {
  const name = pick(row, ["name", "client", "customer"]);
  const reviewText = pick(row, ["review_text", "review text", "review", "testimonial"]);
  const rating = normalizeRating(pick(row, ["rating", "stars", "score"]));

  if (!name || !reviewText) return null;

  return {
    id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "review"}-${index}`,
    name,
    rating,
    reviewText,
  };
}

export async function getReviewData(limit = 6): Promise<ReviewItem[]> {
  try {
    const response = await fetch(REVIEWS_SHEET_CSV_URL, {
      next: { revalidate: REVIEWS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REVIEWS_TIMEOUT_MS),
    });

    if (!response.ok) return [];

    const csv = await response.text();
    return csvToObjects(csv)
      .map(normalizeReview)
      .filter((review): review is ReviewItem => Boolean(review))
      .slice(0, limit);
  } catch {
    return [];
  }
}
