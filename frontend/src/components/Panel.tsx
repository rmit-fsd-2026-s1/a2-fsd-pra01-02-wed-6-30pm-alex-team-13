import { Applicant, BlockedPeriod } from "@/types";

export default function Panel({
    applicant,comment,setComment,onSaveComment,onApprove,onReject,
    blockStart, setBlockStart, blockEnd, setBlockEnd, blockReason, setBlockReason, onBlockVenue, blockedPeriods, onDeleteBlockedPeriod,
}: {
    applicant: Applicant;
    comment: string;
    setComment: (value:string) => void;
    onSaveComment: () => void;
    onApprove: () => void;
    onReject: () => void;
    blockStart: string;
    setBlockStart: (value: string) => void;
    blockEnd: string;
    setBlockEnd: (value: string) => void;
    blockReason: string;
    setBlockReason: (value: string) => void;
    onBlockVenue: () => void;
    blockedPeriods: BlockedPeriod[];
    onDeleteBlockedPeriod: (blockedPeriodId: string) => void;
}) {
    const compliantScore = (
        [applicant.compliantDocs.License, applicant.compliantDocs.liabilityInsuarance, applicant.compliantDocs.businessRegistration].filter(Boolean).length / 3
    ) * 100;

    return(
        <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <h4 className="text-2xl font-bold text-slate-900">{applicant.name}</h4>

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

            <div className="mt-4 grid gap-2 text-slate-700">
                <p>Email: {applicant.email}</p>
                <p>Phone: {applicant.phone}</p>
                <p>Event Name: {applicant.eventName}</p>
                <p>Event Type: {applicant.eventType}</p>
                <p>Expected Guests: {applicant.guests}</p>
                <p>Date: {applicant.eventDate}</p>
                <p>Duration: {applicant.durationHours} hours</p>
                <p>Preferred Venue: {applicant.venueOfChoice}</p>
                <p>Reputation Score: {applicant.reputationScore}</p>
            </div>

            <div className="mt-6">
                <h5 className="text-xl font-semibold text-slate-900">
                Historical Hire List
                </h5>

                <div className="mt-3 space-y-3">
                {applicant.hireHistory.length > 0 ? (
                    applicant.hireHistory.map((hire, index) => (
                    <div
                        key={index}
                        className="rounded-md border border-slate-200 bg-slate-50 p-4"
                    >
                        <p className="text-slate-700">Venue: {hire.venueName}</p>
                        <p className="text-slate-700">Location: {hire.location}</p>
                        <p className="text-slate-700">Event: {hire.event}</p>
                        <p className="text-slate-700">Hire Date: {hire.dateHired}</p>
                        <p className="text-slate-700">Rating: {hire.rating} / 5</p>
                    </div>
                    ))
                ) : (
                    <p className="text-slate-700">No past hiring history available.</p>
                )}
                </div>
            </div>

            <div className="mt-6">
                <h5 className="text-xl font-semibold text-slate-900">
                Compliant Documents
                </h5>
                <div className="mt-3">
                    <p className="font-semibold text-slate-700">
                        Compliance Score: {compliantScore}%
                    </p>
                </div>
                <div className="mt-3 space-y-2 text-slate-700">
                <p>
                    Driver&apos;s License:{" "}
                    {applicant.compliantDocs.License
                    ? "Submitted"
                    : "Missing"}
                </p>
                <p>
                    Liability Insurance:{" "}
                    {applicant.compliantDocs.liabilityInsuarance
                    ? "Submitted"
                    : "Missing"}
                </p>
                <p>
                    Business Registration:{" "}
                    {applicant.compliantDocs.businessRegistration
                    ? "Submitted"
                    : "Missing / Not Required"}
                </p>
                </div>
            </div>

            <div className="mt-6">
                <h5 className="text-xl font-semibold text-slate-900">
                Vendor Comment
                </h5>

                <textarea
                className="mt-3 w-full rounded-md border border-slate-300 p-3 text-slate-700"
                rows={4}
                placeholder="Add notes or feedback about this applicant..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />

                <div className="mt-3 flex flex-wrap gap-3">
                <button
                    onClick={onSaveComment}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Save Comment
                </button>

                <button
                    onClick={onApprove}
                    disabled={applicant.status === "Approved"}
                    className={`rounded-lg px-5 py-2 text-white ${
                    applicant.status === "Approved"
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    Approve Booking
                </button>

                <button
                    onClick={onReject}
                    disabled={applicant.status === "Rejected"}
                    className={`rounded-lg px-5 py-2 text-white ${
                    applicant.status === "Rejected"
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                    Reject Application
                </button>
                </div>

                {applicant.comments && (
                <p className="mt-3 text-slate-700">
                    Saved Comment: {applicant.comments}
                </p>
                )}
            </div>

            <div className="mt-6">
                <h5 className="text-xl font-semibold text-slate-900">
                    Block Venue
                </h5>

                <p className="mt-2 text-slate-700">
                    Block the venue for a certain date and time period.
                </p>

                <div className="mt-3 grid gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Start Date and Time
                        </label>
                        <input 
                            type="datetime-local"
                            value={blockStart} 
                            onChange={(e) => setBlockStart(e.target.value)} 
                            className="w-full rounded-md border border-slate-300 p-2 text-slate-700"
                         />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            End Date and Time
                        </label>
                        <input 
                            type="datetime-local"
                            value={blockEnd} 
                            onChange={(e) => setBlockEnd(e.target.value)} 
                            className="w-full rounded-md border border-slate-300 p-2 text-slate-700"
                         />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Reason
                        </label>
                        <input 
                            type="text"
                            value={blockReason} 
                            onChange={(e) => setBlockReason(e.target.value)} 
                            placeholder="Maintainence, private event, etc..." 
                            className="w-full rounded-md border border-slate-300 p-2 text-slate-700"
                         />
                    </div>

                    <button
                        onClick={onBlockVenue}
                        className="w-fit rounded-lg bg-slate-800 px-5 py-2 text-white hover:bg-slate-900"
                    >Block Venue Period</button>
                </div>
            </div>

            <div className="mt-6">
                <h5 className="text-xl font-semibold text-slate-900">
                    Blocked Periods for {applicant.venueOfChoice}
                </h5>
                <div className="mt-3 space-y-3">
                    {blockedPeriods.filter(
                    (period) => period.venueName === applicant.venueOfChoice
                    ).length > 0 ? (
                    blockedPeriods
                        .filter((period) => period.venueName === applicant.venueOfChoice)
                        .map((period) => (
                        <div
                            key={period.id}
                            className="rounded-md border border-slate-200 bg-slate-50 p-4"
                        >
                            <p className="text-slate-700">
                            Start:{" "}
                            {new Date(period.startDateTime).toLocaleString("en-AU", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                            </p>

                            <p className="text-slate-700">
                            End:{" "}
                            {new Date(period.endDateTime).toLocaleString("en-AU", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                            </p>
                            <p className="text-slate-700">
                            Reason: {period.reason}
                            </p>
                            <button onClick={() => onDeleteBlockedPeriod(period.id)}
                                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                                    Unblock
                                </button>
                        </div>
                        ))
                    ) : (
                    <p className="text-slate-700">
                        No blocked periods for this venue.
                    </p>
                    )}
                </div>
            </div>
        </div>
    );
}