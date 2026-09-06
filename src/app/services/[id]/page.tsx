import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedServices } from "@/lib/cached-content";
import type { ServiceItem } from "@/lib/data";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 900;
export const maxDuration = 10;

export async function generateStaticParams() {
  return [];
}

function findServiceById(services: ServiceItem[], id: string) {
  return services.find(
    (service) =>
      service.id === id ||
      encodeURIComponent(service.id) === id ||
      service.serviceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") === id,
  );
}

function normalizePriceLabel(label: string) {
  return label
    .trim()
    .replace(/^(from|starting\s+from|starting)\s+/i, "")
    .replace(/^price\s*/i, "")
    .replace(/^service\s+(price|fee)\s*:?\s*/i, "");
}

function formatPriceLabel(service: ServiceItem) {
  if (service.priceLabel?.trim()) {
    return `Service price: ${normalizePriceLabel(service.priceLabel)}`;
  }

  if (typeof service.price === "number") {
    return `Service price: GHS ${service.price.toLocaleString()}`;
  }

  return "Service price confirmed after review";
}

function getServiceTopMessage(service: ServiceItem) {
  const serviceKey = `${service.serviceName} ${service.category || ""}`.toLowerCase();

  if (
    serviceKey.includes("dv") ||
    serviceKey.includes("lottery") ||
    serviceKey.includes("usa america")
  ) {
    return {
      eyebrow: "DV Lottery Visa Guidance",
      headline:
        "Selected for the DV Lottery? Let me help you turn your selection into a successful visa journey.",
      body:
        "Get clear guidance for your next steps, documents, interview preparation, and visa journey after selection.",
    };
  }

  if (
    serviceKey.includes("visa application filling") ||
    serviceKey.includes("application filling")
  ) {
    return {
      eyebrow: "Visa Application Filling Support",
      headline:
        "Don't leave your visa application to chance. Get personalized support to help ensure every detail is completed correctly.",
      body:
        "A careful application filling support service to help reduce avoidable mistakes before submission.",
    };
  }

  if (
    serviceKey.includes("interview preparation") ||
    serviceKey.includes("visa coaching")
  ) {
    return {
      eyebrow: "Interview & Visa Coaching",
      headline:
        "Professional Visa Interview Coaching – Helping You Prepare, Perform, and Present Your Case with Confidence.",
      body:
        "Practice your answers, understand your case, and prepare to explain your travel or visa purpose clearly.",
    };
  }

  if (!serviceKey.includes("document")) {
    return null;
  }

  return {
    eyebrow: "Document Review Support",
    headline: "I review your documents. You submit with confidence.",
    body: "A focused document check to help you catch mistakes, organize your file, and prepare a clearer submission before you continue.",
  };
}

function cleanLine(line: string) {
  return line
    .replace(/\*\*/g, "")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\b[A-Z][A-Za-z ]{2,35}:)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) =>
        /:$/.test(part) && index === 0 ? (
          <span key={`${part}-${index}`} className="font-black text-[#0b2d4f]">
            {part}{" "}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

function FormattedDescription({ description }: { description?: string }) {
  const lines = (description || "")
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean)
    .filter((line) => line.toLowerCase() !== "not provided")
    .filter((line) => !/^(product name|item type|category):/i.test(line));

  if (!lines.length) {
    return (
      <p className="text-slate-600">
        Full service details will be shared during the consultation.
      </p>
    );
  }

  const groups = lines.reduce<string[][]>((acc, line) => {
    const isHeading = /^[A-Z][A-Za-z ]{2,45}:$/.test(line);

    if (isHeading || !acc.length) {
      acc.push([line]);
    } else {
      acc[acc.length - 1].push(line);
    }

    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => {
        const [firstLine, ...restLines] = group;
        const headingOnly = /^[A-Z][A-Za-z ]{2,45}:$/.test(firstLine);
        const title = headingOnly ? firstLine.replace(/:$/, "") : "Service details";
        const bodyLines = headingOnly ? restLines : group;

        return (
          <section
            key={`${title}-${groupIndex}`}
            className="rounded-[1.5rem] border border-[#d8d6cf] bg-white p-5 shadow-sm"
          >
            <h3 className="text-xl font-black text-[#0b2d4f]">{title}</h3>
            <div className="mt-4 space-y-3 text-base leading-8 text-slate-700">
              {bodyLines.map((line, index) => {
                const bullet = line.match(/^[-•*]\s+(.*)$/);
                const numbered = line.match(/^\d+[.)]\s+(.*)$/);
                const label = line.match(/^([^:]{2,45}):\s*(.+)$/);
                const isShortStandalone = line.length < 70 && index === 0 && bodyLines.length > 1;

                if (bullet || numbered) {
                  return (
                    <div key={`${line}-${index}`} className="flex gap-3">
                      <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#0d6f73]" />
                      <p>{bullet?.[1] || numbered?.[1]}</p>
                    </div>
                  );
                }

                if (label) {
                  return (
                    <p key={`${line}-${index}`} className="rounded-2xl bg-[#f8f4ea] px-4 py-3">
                      <span className="font-black text-[#0b2d4f]">{label[1]}:</span>{" "}
                      <span>{label[2]}</span>
                    </p>
                  );
                }

                if (isShortStandalone) {
                  return (
                    <p key={`${line}-${index}`} className="font-bold text-[#0b2d4f]">
                      {line}
                    </p>
                  );
                }

                return (
                  <p key={`${line}-${index}`}>
                    <InlineText text={line} />
                  </p>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const services = await getCachedServices();
  const service = findServiceById(services, id);

  if (!service) {
    return {
      title: "Service not found",
    };
  }

  return {
    title: `${service.serviceName} | Services`,
    description: service.description?.slice(0, 155),
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const services = await getCachedServices();
  const service = findServiceById(services, id);

  if (!service) {
    notFound();
  }

  const bookHref = `/book?serviceId=${encodeURIComponent(service.id)}&serviceName=${encodeURIComponent(service.serviceName)}`;
  const priceLabel = formatPriceLabel(service);
  const topMessage = getServiceTopMessage(service);

  return (
    <main className="bg-[#fffdf8]">
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <Link href="/services" className="text-sm font-bold text-[#0d6f73]">
          ← Back to services
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#d8d6cf] bg-white p-6 shadow-sm md:p-8">
          {service.category ? (
            <p className="inline-flex rounded-full bg-[#d8f2f1] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0d6f73]">
              {service.category}
            </p>
          ) : null}

          <h1 className="mt-5 text-4xl font-black leading-tight text-[#0b2d4f] md:text-5xl">
            {service.serviceName}
          </h1>

          <p className="mt-5 inline-flex rounded-full border border-[#0d6f73]/20 bg-[#f8f4ea] px-4 py-2 text-sm font-black text-[#0d6f73]">
            {priceLabel}
          </p>

          {topMessage ? (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#0d6f73]/20 bg-gradient-to-br from-[#d8f2f1] via-white to-[#f8f4ea] p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0d6f73]">
                {topMessage.eyebrow}
              </p>
              <p className="mt-3 text-2xl font-black leading-snug text-[#0b2d4f] md:text-3xl">
                “{topMessage.headline}”
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {topMessage.body}
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={bookHref}
              className="rounded-2xl bg-[#0d6f73] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#0d6f73]/20 transition hover:bg-[#0a585c]"
            >
              Book this service
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-[#0d6f73]/25 bg-[#d8f2f1] px-6 py-3 text-sm font-black text-[#0d6f73] transition hover:bg-[#c5ebe9]"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0d6f73]">
            Full description
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0b2d4f]">
            What this service includes
          </h2>
        </div>

        <FormattedDescription description={service.description} />

        <div className="mt-8 rounded-[1.5rem] bg-[#f8f4ea] p-5 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <h3 className="text-xl font-black text-[#0b2d4f]">Ready to continue?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Book this service so we can review your case and guide you with the next step.
            </p>
          </div>
          <Link
            href={bookHref}
            className="mt-5 inline-flex rounded-2xl bg-[#0d6f73] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0a585c] md:mt-0"
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
