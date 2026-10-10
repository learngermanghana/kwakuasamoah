import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Render Sedifex Markdown or rich text safely, preserving the original wording. */
export function formatBlogContent(content = "") {
  const normalized = String(content).replace(/\r\n?/g, "\n")
    // Some imports escape Markdown punctuation before returning plain text.
    .replace(/\\([*#\-])/g, "$1")
    .replace(/\\[ \t]*\n/g, "\n")
    // Sedifex often uses bold, numbered lines as section headings.
    .replace(/^[ \t]*\*\*(\d+[.)]\s+[^\n]+?)\*\*[ \t]*$/gm, "\n## $1\n")
    .trim();
  if (!normalized) return "";
  const html = marked.parse(normalized, { async: false, gfm: true, breaks: true });
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}
