import Link from "next/link";

type ReturnPageProps = {
  searchParams: Promise<{ trxref?: string | string[]; reference?: string | string[] }>;
};

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function PaymentReturnPage({ searchParams }: ReturnPageProps) {
  const params = await searchParams;
  const trxref = readParam(params.trxref);
  const reference = readParam(params.reference);
  const paymentReference = reference || trxref;

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">Payment received</h1>
      <p className="mt-4 text-zinc-700">
        Thank you. Your payment callback was received and your booking will be finalized only after successful payment verification.
      </p>
      {paymentReference ? (
        <p className="mt-4 rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-800">
          Reference: <span className="font-medium">{paymentReference}</span>
        </p>
      ) : null}
      <p className="mt-3 text-sm text-zinc-600">If you do not hear from us shortly, please share this reference with support.</p>
      <Link href="/book" className="mt-8 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white">
        Back to booking
      </Link>
    </main>
  );
}
