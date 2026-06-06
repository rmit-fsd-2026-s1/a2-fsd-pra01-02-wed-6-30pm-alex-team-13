"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUp(){
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("hirer");
    const [error, setError] = useState("");

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isStrongPassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        return hasUpperCase && hasLowerCase && hasNumber && hasSymbol && isLongEnough;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if(!firstName || !lastName || !email || !password || !confirmPassword){
            setError("Please fill in all fields.");
            return;
        }

        if(!isValidEmail(email)){
            setError("Please enter a valid email address.");
            return;
        }

        if(!isStrongPassword(password)){
            setError("Password must be at least 8 characters and include uppercase, lowercase, a number and a symbol.");
            return;
        }

        if(password !== confirmPassword){
            setError("Passwords do not match.");
            return;
        }

        try{
            const response = await fetch("http://localhost:3001/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password, confirmPassword, role }),
            });

            const data = await response.json();

            if(!response.ok){
                setError(data.message || "Sign up failed.");
                return;
            }

            alert("Account created. Please sign in.");
            router.push("/signin");
        } catch (err){
            console.log(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return(
        <>
            <Header/>
            <Navbar />

            <main className="px-6 py-16">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto p-8 border-2 rounded-lg bg-white text-black"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                        type="text"
                        className="w-full mb-4 p-3 border rounded focus:outline-blue-500"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                        type="text"
                        className="w-full mb-4 p-3 border rounded focus:outline-blue-500"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />

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
                        className="w-full mb-4 p-3 border rounded focus:outline-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full mb-4 p-3 border rounded focus:outline-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium mb-1">I am a</label>
                    <select
                        className="w-full mb-6 p-3 border rounded focus:outline-blue-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="hirer">Hirer</option>
                        <option value="vendor">Vendor</option>
                    </select>

                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded transition">
                        Create Account
                    </button>
                </form>
            </main>

            <Footer />
        </>
    );
}
