"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { ADMIN_LOGIN } from "@/services/graphql";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminLogin] = useMutation(ADMIN_LOGIN);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const result = await adminLogin({ variables: { username, password } });

      if (result.data.adminLogin.success) {
        localStorage.setItem("adminLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError(result.data.adminLogin.message);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Venue Vendors</p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <input
          type="text"
          className="w-full mb-4 p-3 border border-slate-300 rounded text-slate-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full mb-6 p-3 border border-slate-300 rounded text-slate-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded transition cursor-pointer">
          Login
        </button>
      </form>
    </main>
  );
}
