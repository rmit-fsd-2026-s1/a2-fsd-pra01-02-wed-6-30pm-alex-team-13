"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/utils/auth";

export default function ProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            router.push("/signin");
            return;
        }

        const loadProfile = async () => {
            const response = await fetch(`http://localhost:3001/auth/profile/${user.id}`);
            const data = await response.json();
            setProfile(data);
            setPhone(data.phone || "");
            setAvatar(data.avatar || "");
        };

        loadProfile();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!profile) return;

        const response = await fetch(`http://localhost:3001/auth/profile/${profile.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, avatar }),
        });

        if (!response.ok) {
            setMessage("Failed to save profile.");
            return;
        }

        const data = await response.json();
        setProfile(data);
        setMessage("Profile updated.");
    };

    if (!profile) {
        return (
            <>
                <Header />
                <Navbar />
                <main className="px-6 py-16">
                    <p className="text-center text-slate-600">Loading profile...</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <Navbar />

            <main className="bg-slate-100 min-h-screen px-6 py-16">
                <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-slate-900 h-24"></div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col items-center -mt-14">
                            <label className="cursor-pointer group">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow transition group-hover:opacity-80" />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-slate-200 border-4 border-white shadow flex items-center justify-center text-slate-500 text-sm transition group-hover:bg-slate-300">
                                        Upload Photo
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </label>

                            <h2 className="mt-3 text-2xl font-bold text-slate-900">
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <span className="mt-1 px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-medium capitalize">
                                {profile.role}
                            </span>

                            <label className="mt-4 cursor-pointer text-sm text-slate-900 font-medium hover:underline">
                                Change Photo
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </label>
                        </div>

                        {message && (
                            <div className={`mt-6 px-4 py-3 rounded text-sm text-center border ${message === "Profile updated." ? "bg-green-100 border-green-300 text-green-700" : "bg-red-100 border-red-300 text-red-700"}`}>
                                {message}
                            </div>
                        )}

                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500">Email</span>
                                <span className="text-slate-800 font-medium">{profile.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500">Role</span>
                                <span className="text-slate-800 font-medium capitalize">{profile.role}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input
                                type="text"
                                placeholder="Add your phone number"
                                className="w-full p-3 border border-slate-300 rounded focus:outline-slate-500 text-slate-800"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <button onClick={handleSave} className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded transition cursor-pointer">
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
