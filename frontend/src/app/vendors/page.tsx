"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Applicant, BlockedPeriod } from "@/types";
import ApplicantCard from "@/components/ApplicantCard";
import Panel from "@/components/Panel";
import { getApplicants } from "@/utils/localStorage";
import Insights from "@/components/Insights";

export default function VendorsPage(){
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [comment, setComment] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
    const [blockStart, setBlockStart] = useState("");
    const [blockEnd, setBlockEnd] = useState("");
    const [blockReason, setBlockReason] = useState("");

    useEffect(() => {

        const loadApplicants = async () => {

            const data = await getApplicants();

            const mappedApplicants: Applicant[] = data.map((application: any) => ({
                id: String(application.id),

                name: `${application.hirer?.firstName || ""} ${application.hirer?.lastName || ""}`,

                email: application.hirer?.email || "",

                phone: application.hirer?.phone || "",

                eventName: application.eventName || "",

                eventType: "Wedding",

                guests: application.guestCount || 0,

                eventDate: application.eventDate || "",

                durationHours: application.endTime && application.startTime
                    ? (new Date(`1970-01-01T${application.endTime}:00`).getTime() - new Date(`1970-01-01T${application.startTime}:00`).getTime()) / (1000 * 60 * 60)
                    : 0,

                venueOfChoice: application.venue?.name || "Unknown Venue",

                suitability: "High",

                reputationScore: application.reputationScore ?? 0,

                compliantDocs: {
                    License: true,
                    liabilityInsuarance: true,
                    businessRegistration: true
                },

                hireHistory: [],

                comments: application.comments?.[0]?.comment || "",

                selected:
                    application.status === "Approved",

                approved:
                    application.status === "Approved",

                status:
                    application.status || "Pending",

                timesChosen: 0
            }));

            setApplicants(mappedApplicants);

            if(mappedApplicants.length > 0){
                setSelectedApplicant(mappedApplicants[0]);
                setComment(mappedApplicants[0].comments || "");
            }
        };

        loadApplicants();

    }, []);

    const handleSelectedApplicant = (applicant : Applicant) => {
        setSelectedApplicant(applicant);
        setComment(applicant.comments || "");
    };

    const handleSaveComment = () => {
        if(!selectedApplicant) return;

        const updatedApplicants = applicants.map((applicant) =>
            applicant.id === selectedApplicant.id?
            {...applicant, comments: comment}
            : applicant
        );

        setApplicants(updatedApplicants);

        const updatedSelectedApplicant = updatedApplicants.find(
            (applicant) => applicant.id === selectedApplicant.id
        );

        setSelectedApplicant(updatedSelectedApplicant || null);

        alert("Comment Saved.");
    };

    const handleApprove = () => {
        if(!selectedApplicant) return;

        const updatedApplicants: Applicant[] = applicants.map((applicant) =>
            applicant.id === selectedApplicant.id
            ? {...applicant, approved: true, selected: true, status: "Approved", timesChosen: applicant.timesChosen + 1,}
            : applicant
        );

        setApplicants(updatedApplicants);
       

        const updatedSelectedApplicant = updatedApplicants.find(
            (applicant) => applicant.id === selectedApplicant.id
        );

        setSelectedApplicant(updatedSelectedApplicant || null);

        alert("Application approved and booking confirmed");
    };

    const handleRejectApplicant = () => {
        if (!selectedApplicant) return;

        const updatedApplicants: Applicant[] = applicants.map((applicant) =>
        applicant.id === selectedApplicant.id
            ? {
                ...applicant,
                approved: false,
                selected: false,
                status: "Rejected",
            }
            : applicant
        );

        setApplicants(updatedApplicants);
        

        const updatedSelectedApplicant = updatedApplicants.find(
        (applicant) => applicant.id === selectedApplicant.id
        );

        setSelectedApplicant(updatedSelectedApplicant || null);

        alert("Application rejected.");
    };

    const handleBlockedVenue = () => {
        if(!selectedApplicant) return;


        // Validation rule1:
        // Start dat/time and end date/time must both be entered
        if(!blockStart || !blockEnd){
            alert("Enter start date/time and end date/time");
            return;
        }


        // Validation Rule2:
        // End date/time must be after start date/time.
        if(new Date(blockEnd) <= new Date(blockStart)){
            alert("End date/time must be after start date/time");
            return;
        }

        // Validation Rule3:
        // Reason for blocking the venue must not be empty.
        if(!blockReason.trim()){
            alert("Please enter a reason for blocking.");
            return;
        }
        
        const hasOverLap = blockedPeriods.some((period) => {
            if(period.venueName !== selectedApplicant.venueOfChoice) return false;

            const newStart = new Date(blockStart).getTime();
            const newEnd = new Date(blockEnd).getTime();
            const currentStart = new Date(period.startDateTime).getTime();
            const currentEnd = new Date(period.endDateTime).getTime();

            return newStart < currentEnd && newEnd > currentStart;
        });

        if(hasOverLap){
            alert("This blocked period overlaps with an existing blocked period for the same venue.");
            return;
        }
        
        const newBlockedPeriod: BlockedPeriod = {
            id: crypto.randomUUID(),
            venueName: selectedApplicant.venueOfChoice,
            startDateTime: blockStart,
            endDateTime: blockEnd,
            reason: blockReason || "Venue Unavailable at the moment",
        };
        const updatedBlockedPeriods = [...blockedPeriods, newBlockedPeriod];

        setBlockedPeriods(updatedBlockedPeriods);
        

        setBlockStart("");
        setBlockEnd("");
        setBlockReason("");

        alert("Venue blocked.");
    }
    const getStatusBadge = (status: Applicant["status"]) => {
        if(status === "Approved"){
            return (<span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Approved
            </span>
            );
        }

        if(status === "Rejected"){
            return (<span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                Rejected
            </span>
            );
        }

        return (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                Pending
            </span>
        );

    } 

    const sortedApplicants = [...applicants].sort((a, b) => {
        if(sortOrder === "desc"){
            return b.reputationScore - a.reputationScore;
        }
        return a.reputationScore - b.reputationScore;
    });
    return(
        <>
            <Header />
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold text-slate-900 text-white">Vendors Dashboard</h2>
                <p className="mt-3 text-slate-700 text-white">Review applicants based on their event requirements and suitability.</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                <section className="section-glow p-8">
                    <div className="mb-4 flex items-center justify-between gap-4"> 
                        <h3 className="text-2xl font-semibold text-slate-900 text-white mb-4">
                            Applicants
                        </h3>

                        <button 
                        onClick={() => 
                            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                        }
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-900">
                            Sort By Reputation: {sortOrder === "desc" ? "Highest to Lowest" : "Lowest to Highest"}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {sortedApplicants.map((applicant) => (
                            <ApplicantCard
                                key={applicant.id}
                                applicant={applicant}
                                isSelected={selectedApplicant?.id === applicant.id}
                                onClick={() => handleSelectedApplicant(applicant)}
                            />
                        ))}
                    </div>
                </section>
                        
                <section className="section-glow p-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                        Applicant Details
                    </h3>

                    {selectedApplicant ? (
                        <Panel
                        applicant={selectedApplicant}
                        comment={comment}
                        setComment={setComment}
                        onSaveComment={handleSaveComment}
                        onApprove={handleApprove}
                        onReject={handleRejectApplicant}
                        blockStart={blockStart}
                        setBlockStart={setBlockStart}
                        blockEnd={blockEnd}
                        setBlockEnd={setBlockEnd}
                        blockReason={blockReason}
                        setBlockReason={setBlockReason}
                        onBlockVenue={handleBlockedVenue}
                        blockedPeriods={blockedPeriods}
                        />
                    ) : (
                        <p className="text-slate-700">Select an applicant to see details.</p>
                    )}
                </section>
                </div>

                <Insights applicants={applicants} />
            </main>

            <Footer />
        </>
    );
}