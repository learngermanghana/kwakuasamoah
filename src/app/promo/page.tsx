import { fetchPromoAndGallery } from "@/lib/sedifexPromo";

export default async function PromoPage() {
  const { promo, gallery } = await fetchPromoAndGallery();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">{promo?.title ?? "Latest promo"}</h1>
      {promo?.summary ? <p className="mt-3 text-slate-700">{promo.summary}</p> : null}

      {promo?.imageUrl ? (
        <img
          src={promo.imageUrl}
          alt={promo.imageAlt ?? "Promo image"}
          className="mt-6 max-h-96 w-full rounded-2xl object-cover"
        />
      ) : null}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        {gallery.length ? (
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {gallery.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <img src={item.url} alt={item.alt ?? "Gallery image"} className="h-56 w-full object-contain bg-slate-50" />
                {item.caption ? <p className="p-4 text-sm text-slate-700">{item.caption}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-600">No published gallery items yet.</p>
        )}
      </section>
    </main>
  );
}
