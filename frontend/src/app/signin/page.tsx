"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SigninPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid email or password.");
                return;
            }

            localStorage.setItem("currentUser", JSON.stringify(data));
            localStorage.setItem("userId", String(data.id));

            if (data.role === "vendor") {
                router.push("/vendors");
            } else {
                router.push("/hirer");
            }
        } catch (err) {
            console.log(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <Navbar />

            <main className="px-6 py-16">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto p-8 border-2 rounded-lg bg-white text-black"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        className="w-full mb-4 p-3 border rounded focus:outline-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full mb-6 p-3 border rounded focus:outline-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded transition">
                        Login
                    </button>

                    <p className="mt-4 text-center text-sm">
                        Do not have an account? <a href="/signup" className="text-blue-700 font-medium">Sign Up</a>
                    </p>
                </form>
            </main>

            <Footer />
        </>
    );
}
