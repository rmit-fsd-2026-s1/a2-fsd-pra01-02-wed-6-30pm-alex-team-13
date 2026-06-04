"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { seedVenues } from "@/data/seedVenues";
import { Applicant } from "@/types";

import { getApplicants, saveApplicants, initialiseStorage } from "@/utils/api";

export default function HirerPage() {
    const router = useRouter();

    

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("")
    const [guests, setGuests] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("");
    const [isBusiness, setIsBusiness] = useState(false);
    const [abn, setAbn] = useState("");
    const [rankedVenues, setRankedVenues] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [hasLicense, setHasLicense] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);
    const [hasBusReg, setHasBusReg] = useState(false);
    const [pastApplicants, setPastApplicants] = useState<Applicant[]>([]);

    useEffect(() => {
    const loadApplicants = async () => {
        const data = await getApplicants();

        console.log("Loaded existing applicants:", data.length);

        setPastApplicants(data);
    };

    loadApplicants();
}, []);
    const filteredVenues = seedVenues.filter((item) => {
    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();

    return (
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.capacity.toString().includes(q) ||
        item.suitability?.toLowerCase().includes(q)
    );
});

    if (sortOption === "price") {
        filteredVenues.sort((a, b) => a.price - b.price);
    } else if (sortOption === "capacity") {
        filteredVenues.sort((a, b) => a.capacity - b.capacity);
    } else if (sortOption === "rating") {
        filteredVenues.sort((a, b) => b.rating - a.rating);
    }

    const toggleSort = () => {
        if (sortOption === "default") setSortOption("price");
        else if (sortOption === "price") setSortOption("capacity");
        else if (sortOption === "capacity") setSortOption("rating");
        else setSortOption("default");
    };

    const calculateScore = () => {
        const docs = [hasLicense, hasInsurance, (isBusiness ? hasBusReg : true)];
        const count = docs.filter(Boolean).length;
        const score = (count / 3) * 5;
        return Math.round(score * 10) / 10;
    };
    
    const resetForm = () => {
        setName("");
        setPhone("");
        setEventName("");
        setEventType("");
        setGuests("");
        setRankedVenues([]);
        setAbn("");
        setIsBusiness(false);
        setHasLicense(false);
        setHasInsurance(false);
        setHasBusReg(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    if (Number(guests) <= 0) {
        alert("You need at least 1 guest to book a venue!");
        return;
    }

    if (!name || !phone || !eventName || !eventType) {
        alert("Please fill in all the contact and event detials.");
        return;
    }

    if (phone.length < 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    if (rankedVenues.length === 0) {
        alert("Please select and rank at least one venue first!");
        return;
    }
    console.log("submitting form for venue:", rankedVenues[0]);

    const calcScore = calculateScore();

    const newEntry: Applicant = {
        id: Date.now().toString(),
        name,
        email: "team13@rmit.au",
        phone,
        eventName,
        eventType,
        guests: Number(guests),
        eventDate: date,
        durationHours: Number(duration),
        venueOfChoice: rankedVenues[0], 
        suitability: "Medium",
        reputationScore: calcScore, 
        compliantDocs: {
            License: hasLicense,
            liabilityInsuarance: hasInsurance,
            businessRegistration: isBusiness ? hasBusReg : false,
        },
        hireHistory: [],
        comments: `Ranking Order: ${rankedVenues.join(" > ")}. ${abn ? "ABN: " + abn : ""}`,
        selected: false,
        approved: false,
        status: "Pending",
        timesChosen: 0,
    };

    const updatedList = [...pastApplicants, newEntry];
    saveApplicants(updatedList);
    setPastApplicants(updatedList);

    alert(`Success! Application for ${rankedVenues[0]} was submitted with a ${calcScore} star credibility rating.`);
    resetForm();
    router.push("/vendors");
    };


    return (
        <>
            <Header />
            <Navbar />

            <main className="bg-slate-50 min-h-screen py-10">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-2 text-slate-900">Hirer Dashboard</h2>
                    <p className="text-slate-600 mb-8">Search for a venue and fill out the details to apply.</p>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            placeholder="Search by name, location, or capacity..."
                            className="flex-1 p-3 border rounded-lg text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            onClick={toggleSort}
                            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg transition"
                        >
                            Sort Mode: {sortOption.toUpperCase()}
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {filteredVenues.length === 0 ? (
                            <p className="col-span-full text-center py-10 text-slate-500">No venues match your search.</p>
                        ) : (
                            filteredVenues.map((v) => (
                                <div
                                key={v.id}
                                onClick={() => {
                                    setRankedVenues(prev => 
                                        prev.includes(v.name) 
                                            ? prev.filter(n => n !== v.name)
                                            : [...prev, v.name]
                                    );
                                }}
                                className={"p-4 rounded-xl border-2 transition cursor-pointer " + (rankedVenues.includes(v.name) ? "border-blue-600 bg-blue-50" : "border-transparent bg-white")}
                            >
                                {rankedVenues.includes(v.name) && (
                                    <div className="mb-2 text-xs font-bold text-blue-600">
                                        RANKD #{rankedVenues.indexOf(v.name) + 1}
                                    </div>
                                )}
                                <img src={v.image} alt={v.name} className="w-full h-44 object-cover rounded-lg mb-4" />
                                    <h4 className="font-bold text-lg text-slate-900">{v.name}</h4>
                                    <p className="text-sm text-slate-500 mb-4">{v.location}</p>
                                    
                                    <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="material-icons text-blue-600 text-base">people</span>
                                        <span className="font-medium">{v.capacity}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                        <span className="material-icons text-green-600 text-base">attach_money</span>
                                        {v.price}
                                        <p className="text-sm flex items-center gap-1 text-yellow-600">
                                            <span className="material-icons text-base">star</span>
                                            {v.rating}
                                        </p>
                                    </div>
                                </div>
                                    
                                    <button className={"mt-4 w-full py-2 rounded-md font-semibold text-sm transition " + (
                                        rankedVenues.includes(v.name) ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                                    )}>
                                        {rankedVenues.includes(v.name) ? `RANKED #${rankedVenues.indexOf(v.name) + 1}` : "SELECT & RANK"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-xl border border-slate-200">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">Event Application Form</h3>
                        
                        {rankedVenues.length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-bold text-blue-800 mb-1">Ranked Preferences</p>
                                <div className="flex flex-wrap gap-2">
                                    {rankedVenues.map((vName, i) => (
                                        <span key={i} className="bg-white px-2 py-1 rounded border text-xs text-blue-700 font-medium">
                                            #{i + 1}: {vName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <input placeholder="Your Full Name" className="p-3 border rounded text-black" value={name} onChange={(e) => setName(e.target.value)} />
                            <input placeholder="Contact Phone" className="p-3 border rounded text-black" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <input placeholder="Event Name" className="p-3 border rounded text-black" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            <input placeholder="Event Type (e.g. Wedding, Party)" className="p-3 border rounded text-black" value={eventType} onChange={(e) => setEventType(e.target.value)} />
                            <input type="number" placeholder="Number of Guests" className="p-3 border rounded text-black" value={guests} onChange={(e) => setGuests(e.target.value)} />
                            <input type="date" className="p-3 border rounded text-black" value={date} onChange={(e) => setDate(e.target.value)} />
                            <div className="md:col-span-2 flex items-center gap-2 p-2 bg-slate-50 rounded border">
                                <input type="checkbox" id="businessTick" 
                                    checked={isBusiness} onChange={() => setIsBusiness(!isBusiness)} />
                                <label htmlFor="businessTick" className="text-sm font-medium text-slate-700 cursor-pointer">
                                    Applying on behalf of a business/organization?
                                </label>
                            </div>

                            {isBusiness && (
                                <div className="md:col-span-2">
                                    <input 
                                        placeholder="Enter ABN Number" 
                                        className="w-full p-3 border rounded text-black border-blue-200" 
                                        value={abn} 
                                        onChange={(e) => setAbn(e.target.value)} 
                                    />
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 space-y-3 p-4 bg-slate-50 rounded border">
                                        <p className="text-sm font-bold text-slate-700 underline decoration-blue-500">Compliance Verification</p>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="license" checked={hasLicense} onChange={() => setHasLicense(!hasLicense)} />
                                            <label htmlFor="license" className="text-sm text-slate-700">I confirm I have a valid Driver's License</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="insurance" checked={hasInsurance} onChange={() => setHasInsurance(!hasInsurance)} />
                                            <label htmlFor="insurance" className="text-sm text-slate-700">I confirm I have valid Public Liability Insurance</label>
                                        </div>
                                        {isBusiness && (
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="busReg" checked={hasBusReg} onChange={() => setHasBusReg(!hasBusReg)} />
                                                <label htmlFor="busReg" className="text-sm text-slate-700">Business Registration is active</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </div>
                            )}
                        </div>

                        <button className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg transition uppercase tracking-wider">
                            Submit Application
                        </button>
                    </form>

                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">My Past Applications</h3>
                        {pastApplicants.length === 0 ? (
                            <p className="text-slate-500 italic">You haven't submitted any applications yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {pastApplicants.map((a, idx) => (
                                    <div key={idx} className="p-4 bg-white border rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">{a.venueOfChoice}</p>
                                            <p className="text-sm text-slate-500">{a.eventName} • {a.eventDate}</p>
                                        </div>
                                        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                                            {a.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}