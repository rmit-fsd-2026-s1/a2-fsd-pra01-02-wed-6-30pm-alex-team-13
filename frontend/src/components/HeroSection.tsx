import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="rounded-2xl bg-slate-100 px-8 py-16 shadow-sm">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Hiring Venues Made Simple
                </p>

                <h2 className="mt-3 text-4xl font-bold leading-tight text-slate-900">
                    Find the right event venue and manage applications with confidence
                </h2>

                <p className="mt-5 text-lg text-slate-700">
                    Venue Vendors is a client-side web prototype and is designed to support the process of venue hiring between hirers and vendors.
                    Applicants can prepare event details and vendors can review the applications.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/vendors"
                        className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                    >
                        Go to Vendors Page
                    </Link>

                    <Link
                        href="/signin"
                        className="rounded-lg border border-slate-300 px-5 py-3 text-slate-800 hover:bg-slate-200"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    )
}