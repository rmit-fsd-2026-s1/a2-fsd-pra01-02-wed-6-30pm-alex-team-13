import { Applicant } from "@/types";

export default function Insights({
    applicants,
}: {
    applicants: Applicant[];
}) {
    if(applicants.length === 0){
        return null;
    }

    const sortedByChosen = [...applicants].sort(
        (a, b) => b.timesChosen - a.timesChosen
    );

    const mostChosen = sortedByChosen[0];
    let leastChosen = sortedByChosen[sortedByChosen.length - 1];;
    if(sortedByChosen[sortedByChosen.length - 1].timesChosen === 0){
        leastChosen = sortedByChosen[sortedByChosen.length - 2];
    }
    const unselected = applicants.filter((applicant) => applicant.timesChosen === 0);

    return(
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
                Vendor Insights
            </h3>
            <p className="mt-2 text-slate-700">
                Applicants selection patterns summary.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-green-50 p-5 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800">
                        Most Chosen Applicant
                    </h4>
                    <p className="mt-3 text-slate-900 font-medium">
                        {mostChosen.name}
                    </p>
                    <p className="text-slate-700">
                        Times chosen: {mostChosen.timesChosen}
                    </p>
                </div>

                <div className="rounded-xl bg-yellow-50 p-5 border border-yellow-200">
                    <h4 className="text-lg font-semibold text-yellow-800">
                        Least Chosen Applicant
                    </h4>
                    <p className="mt-3 text-slate-900 font-medium">
                        {leastChosen.name}
                    </p>
                    <p className="text-slate-700">
                        Times chosen: {leastChosen.timesChosen}
                    </p>
                </div>

                <div className="rounded-xl bg-red-50 p-5 border border-red-200">
                    <h4 className="text-lg font-semibold text-red-800">
                        Applicants Not Selected
                    </h4>

                    {unselected.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-slate-700">
                            {unselected.map((applicant) => (
                                <li key={applicant.id}>
                                {applicant.name} ({applicant.timesChosen})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-3 text-slate-700">
                        All applicants have been selected at least once.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}