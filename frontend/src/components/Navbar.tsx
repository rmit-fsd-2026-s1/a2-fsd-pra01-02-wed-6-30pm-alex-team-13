"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setFirstName(userData.firstName || "");
      setRole(userData.role || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setFirstName("");
    setRole("");
    router.push("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-slate-850 text-white">

      <div className="flex gap-6 font-medium">
        <Link href="/" className="hover:text-blue-300 transition">HOME</Link>
        {role === "vendor" && (
          <Link href="/vendors" className="hover:text-blue-300 transition">VENDOR</Link>
        )}
        {role === "hirer" && (
          <Link href="/hirer" className="hover:text-blue-300 transition">HIRER</Link>
        )}
        {isLoggedIn && (
          <Link href="/profile" className="hover:text-blue-300 transition">PROFILE</Link>
        )}
      </div>

      <div className="flex items-center gap-5">
        {isLoggedIn ? (
          <>
            <span className="text-sm">Welcome, {firstName}</span>
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
            <Link href="/signup" className="hover:text-blue-300 transition">
              SIGN UP
            </Link>
          </div>
        )}
      </div>

    </nav>
  );
}
