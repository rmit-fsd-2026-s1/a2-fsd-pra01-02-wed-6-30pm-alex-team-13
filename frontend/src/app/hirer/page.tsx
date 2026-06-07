"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { getAllVenues, getMyApplications, createBooking } from "@/utils/api";

export default function HirerPage() {
    const router = useRouter();

    const [hirerId, setHirerId] = useState("");
    const [venues, setVenues] = useState<any[]>([]);
    const [myApplications, setMyApplications] = useState<any[]>([]);

    const [eventName, setEventName] = useState("");
    const [guests, setGuests] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            router.push("/signin");
            return;
        }
        if (user.role !== "hirer") {
            router.push("/vendors");
            return;
        }

        setHirerId(String(user.id));

        const loadData = async () => {
            const venueData = await getAllVenues();
            setVenues(venueData);

            const appData = await getMyApplications(String(user.id));
            setMyApplications(appData);
        };

        loadData();
    }, []);

    const filteredVenues = venues.filter((item) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(q) ||
            item.Location.toLowerCase().includes(q) ||
            item.capacity.toString().includes(q) ||
            item.suitabilityKeywords?.toLowerCase().includes(q)
        );
    });

    if (sortOption === "price") {
        filteredVenues.sort((a, b) => a.price - b.price);
    } else if (sortOption === "capacity") {
        filteredVenues.sort((a, b) => a.capacity - b.capacity);
    }

    const toggleSort = () => {
        if (sortOption === "default") setSortOption("price");
        else if (sortOption === "price") setSortOption("capacity");
        else setSortOption("default");
    };

    const resetForm = () => {
        setEventName("");
        setGuests("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setSelectedVenue(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!eventName) {
            alert("Please enter an event name.");
            return;
        }

        if (Number(guests) <= 0) {
            alert("You need at least 1 guest to book a venue!");
            return;
        }

        if (!date || !startTime || !endTime) {
            alert("Please enter the date, start time and end time.");
            return;
        }

        if (endTime <= startTime) {
            alert("End time must be after start time.");
            return;
        }

        if (!selectedVenue) {
            alert("Please select a venue first!");
            return;
        }

        const bookingData = {
            eventName,
            guestCount: Number(guests),
            eventDate: date,
            startTime,
            endTime,
            venueId: selectedVenue,
        };

        const saved = await createBooking(hirerId, bookingData);

        if (!saved || saved.message) {
            alert(saved?.message || "Failed to submit application.");
            return;
        }

        alert("Application submitted!");
        resetForm();

        const appData = await getMyApplications(hirerId);
        setMyApplications(appData);
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

                    {venues.filter((v) => v.featured).length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Featured Venues</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {venues.filter((v) => v.featured).map((v) => (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVenue(selectedVenue === v.id ? null : v.id)}
                                        className={"p-4 rounded-xl border-2 transition cursor-pointer " + (selectedVenue === v.id ? "border-blue-600 bg-blue-50" : "border-yellow-400 bg-yellow-50")}
                                    >
                                        <img src={v.imageUrl} alt={v.name} className="w-full h-44 object-cover rounded-lg mb-4" />
                                        <h4 className="font-bold text-lg text-slate-900">{v.name}</h4>
                                        <p className="text-sm text-slate-500 mb-2">{v.Location}</p>
                                        <span className="text-xs font-bold text-yellow-700">FEATURED</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {filteredVenues.length === 0 ? (
                            <p className="col-span-full text-center py-10 text-slate-500">No venues found.</p>
                        ) : (
                            filteredVenues.map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => setSelectedVenue(selectedVenue === v.id ? null : v.id)}
                                    className={"p-4 rounded-xl border-2 transition cursor-pointer " + (selectedVenue === v.id ? "border-blue-600 bg-blue-50" : "border-transparent bg-white")}
                                >
                                    <img src={v.imageUrl} alt={v.name} className="w-full h-44 object-cover rounded-lg mb-4" />
                                    <h4 className="font-bold text-lg text-slate-900">{v.name}</h4>
                                    <p className="text-sm text-slate-500 mb-4">{v.Location}</p>

                                    <div className="mt-3 flex items-center justify-between text-gray-700">
                                        <span className="font-medium">Capacity: {v.capacity}</span>
                                        <span className="font-semibold">${v.price}</span>
                                    </div>

                                    <button className={"mt-4 w-full py-2 rounded-md font-semibold text-sm transition " + (
                                        selectedVenue === v.id ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                                    )}>
                                        {selectedVenue === v.id ? "SELECTED" : "SELECT VENUE"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-xl border border-slate-200">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">Event Application Form</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <input placeholder="Event Name" className="p-3 border rounded text-black" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            <input type="number" placeholder="Number of Guests" className="p-3 border rounded text-black" value={guests} onChange={(e) => setGuests(e.target.value)} />
                            <input type="date" className="p-3 border rounded text-black" value={date} onChange={(e) => setDate(e.target.value)} />
                            <div></div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Start Time</label>
                                <input type="time" className="w-full p-3 border rounded text-black" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">End Time</label>
                                <input type="time" className="w-full p-3 border rounded text-black" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                        </div>

                        <button className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg transition uppercase tracking-wider">
                            Submit Application
                        </button>
                    </form>

                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">My Past Applications</h3>
                        {myApplications.length === 0 ? (
                            <p className="text-slate-500 italic">You haven't submitted any applications yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {myApplications.map((a) => (
                                    <div key={a.id} className="p-4 bg-white border rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">{a.venue?.name}</p>
                                            <p className="text-sm text-slate-500">{a.eventName} - {a.eventDate}</p>
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
