"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    
    if (user) {
      console.log("Navbar: User is logged in as", user);
      setIsLoggedIn(true);
      
      const userData = JSON.parse(user);
      setUserEmail(userData.email);
    } else {
      console.log("Navbar: No user found in storage.");
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out user...");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUserEmail("");
    
    router.push("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-slate-850 text-white">
      
      <div className="flex gap-6 font-medium">
        <Link href="/" className="hover:text-blue-300 transition">HOME</Link>
        <Link href="/vendors" className="hover:text-blue-300 transition">VENDOR</Link>
        <Link href="/hirer" className="hover:text-blue-300 transition">HIRER</Link>
      </div>

      <div className="flex items-center gap-5">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded text-sm font-bold"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link href="/signin" className="hover:text-blue-300 transition">
              SIGN IN
            </Link>
            <Link href="/signup" className="hover:text-blue-300 transitionext-slate-800 transition">
              SIGN UP
            </Link>
          </div>
        )}
      </div>

    </nav>
  );
}