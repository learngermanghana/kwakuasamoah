import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceData, type ServiceItem } from "@/lib/data";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

function findServiceById(services: ServiceItem[], id: string) {
  return services.find(
    (service) =>
      service.id === id ||
      encodeURIComponent(service.id) === id ||
      service.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === id,
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

function FormattedDescription({ description }: { description?: string }) {
  const lines = (description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return (
      <p className="text-slate-600">
        Full service details will be shared during the consultation.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-base leading-8 text-slate-700">
      {lines.map((line, index) => {
        const bullet = line.match(/^[-•*]\s+(.*)$/);
        const label = line.match(/^([^:]{2,45}):\s*(.*)$/);

        if (bullet) {
          return (
            <p key={`${line}-${index}`} className="flex gap-3 rounded-2xl bg-[#f8f4ea] px-4 py-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0d6f73]" />
              <span>{bullet[1]}</span>
            </p>
          );
        }

        if (label) {
          return (
            <p key={`${line}-${index}`} className="rounded-2xl border border-[#d8d6cf] bg-white px-4 py-3">
              <span className="font-bold text-[#0b2d4f]">{label[1]}:</span>{" "}
              <span>{label[2]}</span>
            </p>
          );
        }

        return <p key={`${line}-${index}`}>{line}</p>;
      })}
    </div>
  );
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const services = await getServiceData();
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
  const services = await getServiceData();
  const service = findServiceById(services, id);

  if (!service) {
    notFound();
  }

  const bookHref = `/book?serviceId=${encodeURIComponent(service.id)}&serviceName=${encodeURIComponent(service.serviceName)}`;
  const priceLabel = formatPriceLabel(service);

  return (
    <main className="bg-[#fffdf8]">
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <Link href="/services" className="text-sm font-bold text-[#0d6f73]">
          ← Back to services
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-[2rem] border border-[#d8d6cf] bg-white p-4 shadow-sm">
            <div className="rounded-[1.5rem] bg-[#f8f4ea] p-4">
              <img
                src={service.image}
                alt={service.imageAlt || service.serviceName}
                className="h-[360px] w-full rounded-[1.25rem] object-contain"
              />
            </div>
          </div>

          <div>
            {service.category ? (
              <p className="inline-flex rounded-full bg-[#d8f2f1] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0d6f73]">
                {service.category}
              </p>
            ) : null}

            <h1 className="mt-5 text-4xl font-black leading-tight text-[#0b2d4f] md:text-5xl">
              {service.serviceName}
            </h1>

            <p className="mt-5 inline-flex rounded-full border border-[#0d6f73]/20 bg-white px-4 py-2 text-sm font-black text-[#0d6f73] shadow-sm">
              {priceLabel}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Read the full service details below, then book a consultation when you are ready.
            </p>

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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <article className="rounded-[2rem] border border-[#d8d6cf] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0d6f73]">
            Full description
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0b2d4f]">
            What this service includes
          </h2>
          <div className="mt-6">
            <FormattedDescription description={service.description} />
          </div>

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
        </article>
      </section>
    </main>
  );
}
