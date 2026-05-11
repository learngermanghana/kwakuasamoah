export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Terms and Conditions</h1>
      <p className="mt-4 text-zinc-700">
        These Terms and Conditions govern all consultations and booking services provided by Kwaku Lotteryy.
      </p>

      <div className="mt-8 space-y-6 text-zinc-700">
        <div>
          <h2 className="text-xl font-semibold">Service scope</h2>
          <p className="mt-2">
            We provide travel and relocation advisory services only. We do not represent embassies, immigration
            authorities, or government offices, and we do not issue visas, permits, or passports.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">No visa or approval guarantee</h2>
          <p className="mt-2">
            We do not promise visa approval, appointment availability, or immigration outcomes. Final decisions are
            made solely by the relevant embassy, consulate, or immigration authority.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Paid booking service</h2>
          <p className="mt-2">
            All consultation bookings are paid services. Your payment secures your consultation slot and compensates
            the time and professional guidance prepared for your selected service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">No refund policy</h2>
          <p className="mt-2">
            All payments are final and non-refundable once made, including missed sessions, late attendance,
            incomplete documentation, change of mind, or external decision outcomes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Client information and responsibility</h2>
          <p className="mt-2">
            You are responsible for providing complete, accurate, and truthful information. We are not liable for
            losses or refusals resulting from false information, withheld details, or submission errors.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Anti-fraud and payments</h2>
          <p className="mt-2">
            To prevent fraud, clients should communicate only through our official channels listed on this website.
            Never send payment to unverified third parties. We are not responsible for money sent to fraudulent
            accounts or impersonators.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Third-party and government fees</h2>
          <p className="mt-2">
            Our consultation fee does not include embassy fees, visa fees, travel tickets, insurance, or any other
            third-party costs unless explicitly stated in writing.
          </p>
        </div>
      </div>
    </section>
  );
}
