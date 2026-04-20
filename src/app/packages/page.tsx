import { getPackageData } from "@/lib/data";
import { PackageCard } from "@/components/package-card";

export default async function PackagesPage() {
  const items = await getPackageData();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl font-bold">Packages</h1>
      <p className="mt-3 text-slate-600">Explore travel, study, and relocation support packages.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => <PackageCard key={item.slug} item={item} />)}
      </div>
    </section>
  );
}
