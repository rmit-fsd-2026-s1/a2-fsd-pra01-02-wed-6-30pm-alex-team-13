"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SigninPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        let usersData = localStorage.getItem("users");

        if (!usersData) {
            console.log("No user databsae found, creating default account");
            let defaultUsers = [{ email: "team13@rmit.au", password: "assignment1" }];
            localStorage.setItem("users", JSON.stringify(defaultUsers));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Submit button clicked. Checking credentials for:", email);

        if (!email.includes("@") || !email.includes(".")) {
            alert("Please enter a proper email address.");
            return;
        }

        if (password.length < 6 || !/\d/.test(password)) {
            alert("Password is too weak. Make sure it has 6+ characters and a number.");
            return;
        }

        const storedUsers = localStorage.getItem("users");
        let userArray = [];

        if (storedUsers) {
            userArray = JSON.parse(storedUsers);
        }

        let isUserAuthenticated = false;

        for (let i = 0; i < userArray.length; i++) {
            if (userArray[i].email === email && userArray[i].password === password) {
                isUserAuthenticated = true;
                break;
            }
        }

        if (isUserAuthenticated) {
            console.log("Login success! Redirecting to hirer dashboard.");
            localStorage.setItem("currentUser", JSON.stringify({ email: email }));
            
            router.push("/hirer"); 
        } else {
            console.log("Login failed: Invalid email or password.");
            alert("Invalid email or password. Please try again.");
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
                    <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

                    <div className="bg-blue-50 p-3 mb-6 rounded text-xs text-center border border-blue-200">
                        <p>team13@rmit.au</p>
                        <p>assignment1</p>
                    </div>

                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="team13@rmit.au"
                        className="w-full mb-4 p-3 border rounded focus:outline-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="assignment1"
                        className="w-full mb-6 p-3 border rounded focus:outline-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded transition">
                        Login
                    </button>
                </form>
            </main>

            <Footer />
        </>
    );
}