import { Applicant } from "@/types";

export default function ApplicantCard({
    applicant,
    isSelected,
    onClick,
}: {
    applicant: Applicant;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 shadow-sm cursor-pointer transition ${
        isSelected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-blue-400"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-slate-900">
            {applicant.name}
          </h4>
          <p className="mt-1 text-slate-700">Event: {applicant.eventName}</p>
          <p className="text-slate-700">Type: {applicant.eventType}</p>
          <p className="text-slate-700">Guests: {applicant.guests}</p>
          <p className="text-slate-700">
            Preferred Venue: {applicant.venueOfChoice}
          </p>
          <p className="mt-2 font-medium">
            Suitability:{" "}
            <span
              className={
                applicant.suitability === "High"
                  ? "text-green-600"
                  : applicant.suitability === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {applicant.suitability}
            </span>
          </p>
          <p className="text-slate-700">
            Reputation Score: {applicant.reputationScore}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            applicant.status === "Approved"
              ? "bg-green-100 text-green-700"
              : applicant.status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {applicant.status}
        </span>
      </div>
    </div>
  );
}