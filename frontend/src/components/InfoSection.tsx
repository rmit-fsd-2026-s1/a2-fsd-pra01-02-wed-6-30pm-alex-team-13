export default function InfoSection() {
    return (
        <section className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">
                    Smart Application Review
                </h3>
                <p className="mt-3 text-slate-700">
                    Vendors can review event requirements, suitability, reputation, and
                    supporting compliance information before making a booking decision.
                </p>
            </div>

            <div className="rounded-xl border border-slate-20 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">
                    Clear Venue Hiring Workflow
                </h3>
                <p className="mt-3 text-slate-700">
                     The system supports a process where hirers prepare event
                    applications and vendors evaluate applicants.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">
                Local Prototype Storage
                </h3>
                <p className="mt-3 text-slate-700">
                This prototype uses browser localStorage to maintain front-end data
                for sample applicants, comments, and booking approvals. It does not use a database.
                </p>
            </div>
        </section>
    )
}