"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/utils/auth";
import { Applicant, BlockedPeriod } from "@/types";
import ApplicantCard from "@/components/ApplicantCard";
import Panel from "@/components/Panel";
import { getApplicants, updateApplicantStatus, saveComment, saveBlockedTimeSlot, getBlockedTimeSlots, deleteBlockedTimeSlot, createVenue, updateVenue, deleteVenue } from "@/utils/api";

import {getVendorVenues} from "@/utils/api";
import dynamic from "next/dynamic";

const Insights = dynamic(() => import("@/components/Insights"), {
    ssr: false,
});

export default function VendorsPage(){
    const router = useRouter();

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            router.push("/signin");
        } else if (user.role !== "vendor") {
            router.push("/hirer");
        }
    }, []);

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [comment, setComment] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
    const [blockStart, setBlockStart] = useState("");
    const [blockEnd, setBlockEnd] = useState("");
    const [blockReason, setBlockReason] = useState("");
    const [venues, setVenues] = useState<any[]>([]);
    const [venueForm, setVenueForm] = useState({
        name: "",
        Location: "",
        capacity: 0,
        price: 0,
        imageUrl: "",
        description: "",
        suitabilityKeywords: "",
    });

    const [editingVenueId, setEditingVenueId] = useState<number | null>(null);

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

            const venueData = await getVendorVenues()
            setVenues(venueData);

            const blockedSlots = await getBlockedTimeSlots(1);

            const mappedBlockedSlots: BlockedPeriod[] = blockedSlots.map((slot: any) => ({
                id: String(slot.id),
                venueName: slot.venue?.name || "Unknown",
                startDateTime: slot.startDateTime,
                endDateTime: slot.endDateTime,
                reason: slot.reason,
            }));

            setBlockedPeriods(mappedBlockedSlots);

            if(mappedApplicants.length > 0){
                setSelectedApplicant(mappedApplicants[0]);
                setComment(mappedApplicants[0].comments || "");
            }
        };

        loadApplicants();

    }, []);

    useEffect(() => {
        const role = localStorage.getItem("role");

        if(role !== "vendor"){
            alert("Only vendors can access this page.");
            window.location.href = "/signin";
        }
    }, []);

    //leave afterauthentication is implemented
    useEffect(() => {
        localStorage.setItem("role", "vendor");
    }, []);

    const handleSelectedApplicant = (applicant : Applicant) => {
        setSelectedApplicant(applicant);
        setComment(applicant.comments || "");
    };

    const handleSaveComment = async () => {
        if(!selectedApplicant) return;

        const savedComment =
            await saveComment(
                selectedApplicant.id,
                comment
            );

        if(!savedComment){
            alert("Failed to save comment.");
            return;
        }

        const updatedApplicants: Applicant[] =
            applicants.map((applicant) =>
                applicant.id === selectedApplicant.id
                ? {
                    ...applicant,
                    comments: comment
                }
                : applicant
            );

        setApplicants(updatedApplicants);

        const updatedSelectedApplicant =
            updatedApplicants.find(
                (applicant) =>
                    applicant.id === selectedApplicant.id
            );

        setSelectedApplicant(
            updatedSelectedApplicant || null
        );

        alert("Comment saved.");
    };

    const handleApprove = async () => {
        if(!selectedApplicant) return;

        const updatedApplication = await updateApplicantStatus(selectedApplicant.id, "Approved");

        if(!updatedApplication){
            alert("Failed to approve application.");
            return;
        }
        

        const updatedApplicants: Applicant[] = applicants.map((applicant) => applicant.id === selectedApplicant.id ? {
                ...applicant,
                status: "Approved",
                approved: true,
                reputationScore: updatedApplication.reputationScore
            } : applicant
        );

        setApplicants(updatedApplicants);

        const updatedSelectedApplicant = 
            updatedApplicants.find((applicant) => applicant.id === selectedApplicant.id);

        setSelectedApplicant(updatedSelectedApplicant || null);

        alert("Application approved and booking confirmed");
    };

    const handleRejectApplicant = async () => {
        if (!selectedApplicant) return;

        const updatedApplication = await updateApplicantStatus(selectedApplicant.id, "Rejected");

        if(!updatedApplication){
            alert("Failed to reject application.");
            return;
        }
        

        const updatedApplicants: Applicant[] = applicants.map((applicant) => applicant.id === selectedApplicant.id ? {
                ...applicant,
                status: "Rejected",
                approved: false,
                selected: false
            } : applicant
        );

        setApplicants(updatedApplicants);

        const updatedSelectedApplicant = 
            updatedApplicants.find((applicant) => applicant.id === selectedApplicant.id);

        setSelectedApplicant(updatedSelectedApplicant || null);

        alert("Application rejected.");
    };

    const handleBlockedVenue = async () => {
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

        const savedBlockedSlot = await saveBlockedTimeSlot(
            1, blockStart, blockEnd, blockReason
        );

        if(!savedBlockedSlot){
            alert("Failed to block the venue.");
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

    const handleDeleteBlockedPeriod = async (blockedPeriodId: string) => {
        const deleted = await deleteBlockedTimeSlot(1, Number(blockedPeriodId));

        if(!deleted){
            alert("Failed to unblock period.");
            return;
        }

        const updateBlockedPeriods = blockedPeriods.filter(
            (period) => period.id !== blockedPeriodId
        );
        setBlockedPeriods(updateBlockedPeriods);
        alert("Blocked period removed.");
    }

    const handleSaveVenue = async () => {
        if(!venueForm.name || !venueForm.Location || !venueForm.capacity || !venueForm.price || !venueForm.description){
            alert("Please fill in all required fields.");
            return;
        }

        const venueData = {
            ...venueForm,
            capacity: Number(venueForm.capacity),
            price: Number(venueForm.price),
        };

        if(editingVenueId){
            const updatedVenue = await updateVenue(editingVenueId, venueData);

            const updatedVenues = venues.map((venue) => 
                venue.id === editingVenueId ? updatedVenue : venue);

            setVenues(updatedVenues);
            alert("Venue updated.");
        }else{
            const newVenue = await createVenue(venueData);

            setVenues([...venues, newVenue]);
            alert("Venue created.");
        }

        setVenueForm({
            name: "",
            Location: "",
            capacity: 0,
            price: 0,
            imageUrl: "",
            description: "",
            suitabilityKeywords: "",
        });

        setEditingVenueId(null);
    }

    const handleDeleteVenue = async (venueId: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this venue?");

        if(!confirmed) return;

        await deleteVenue(venueId);

        const updatedVenues = venues.filter((venue) => venue.id !== venueId);

        setVenues(updatedVenues);

        alert("Venue deleted.");
    };

    const handleEditVenue = (venue: any) => {
        setEditingVenueId(venue.id);
        setVenueForm({
            name: venue.name || "",
            Location: venue.Location || "",
            capacity: venue.capacity|| 0,
            price: venue.price || 0,
            imageUrl: venue.imageUrl || "",
            description: venue.description || "",
            suitabilityKeywords: venue.suitabilityKeywords || "",
        });
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

                <section className="section-glow p-8">
                    <h3 className="text-2xl font-semibold text-slate-900 text-white mb-4">
                        My Venues
                    </h3>  

                    {venues.map((venue) =>(
                        <div key={venue.id} className="rounded-lg bg-white p-4 mb-3 text-slate-800">
                            <p className="font-bold">{venue.name}</p>
                            <p>Location: {venue.Location }</p>
                            <p>Capacity: {venue.capacity}</p>
                            <p>Price: ${venue.price}</p>
                            <div className="mt-3 flex gap-3">
                            <button
                                onClick={() => handleEditVenue(venue)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteVenue(venue.id)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                        </div>
                    ))}

                    <div className="mt-6 rounded-lg bg-white p-4 text-slate-800">
                        <h4 className="text-xl font-bold mb-4">
                            {editingVenueId ? "Edit Venue" : "Add New Venue"}
                        </h4>   

                        <div className="grid gap-3">
                            <input
                                type="text"
                                placeholder="Venue name"
                                value={venueForm.name}
                                onChange={(e) => setVenueForm({...venueForm, name: e.target.value})}
                                className="rounded-md border border-slate-300 p-2"
                            />

                            <input
                                type="text"
                                placeholder="Location"
                                value={venueForm.Location}
                                onChange={(e) => setVenueForm({...venueForm, Location: e.target.value})}
                                className="rounded-md border border-slate-300 p-2"
                            />

                            <label>
                                Capacity
                            <input
                                type="number"
                                placeholder="Capacity"
                                value={venueForm.capacity}
                                onChange={(e) => setVenueForm({...venueForm, capacity: Number(e.target.value),})}
                                className="rounded-md border border-slate-300 p-2"
                            />
                            </label>

                            <label>
                                Price   $
                            <input
                                type="number"
                                placeholder="Price"
                                value={venueForm.price}
                                onChange={(e) => setVenueForm({...venueForm, price: Number(e.target.value),})}
                                className="rounded-md border border-slate-300 p-2"
                            />
                            </label>
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={venueForm.imageUrl}
                                onChange={(e) => setVenueForm({...venueForm, imageUrl: e.target.value})}
                                className="rounded-md border border-slate-300 p-2"
                            />

                            <textarea
                                placeholder="Description"
                                value={venueForm.description}
                                onChange={(e) => setVenueForm({...venueForm, description: e.target.value})}
                                className="rounded-md border border-slate-300 p-2"
                            />

                            <input
                                type="text"
                                placeholder="Suitability keywords"
                                value={venueForm.suitabilityKeywords}
                                onChange={(e) => setVenueForm({...venueForm, suitabilityKeywords: e.target.value})}
                                className="rounded-md border border-slate-300 p-2"
                            />

                            <button
                                onClick={handleSaveVenue}
                                className="w-fit rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                            >
                                {editingVenueId ? "Update Venue" : "Create Venue"}
                            </button>
                        </div> 
                    </div>  
                </section>

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
                        onDeleteBlockedPeriod={handleDeleteBlockedPeriod}
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