"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_REPORTS } from "@/services/graphql";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";

export default function ReportPage() {
  const router = useRouter();
  const { data } = useQuery(GET_REPORTS, { fetchPolicy: "network-only" });

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/");
    }
  }, []);

  const topVenues = data?.topVenues || [];
  const topApplicants = data?.topApplicants || [];

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Venue Vendors - Admin Report", 14, 20);

    doc.setFontSize(14);
    doc.text("Top 3 Most Popular Venues", 14, 35);
    doc.setFontSize(11);
    let y = 45;
    topVenues.forEach((v: any, i: number) => {
      doc.text(`${i + 1}. ${v.venueName} - ${v.bookings} bookings, popular day ${v.popularDay}, slot ${v.popularTimeSlot}`, 14, y);
      y += 8;
    });

    y += 8;
    doc.setFontSize(14);
    doc.text("Top 3 Most Active Applicants", 14, y);
    y += 10;
    doc.setFontSize(11);
    topApplicants.forEach((a: any, i: number) => {
      doc.text(`${i + 1}. ${a.applicantName} - ${a.successfulBookings} successful / ${a.totalApplications} applications`, 14, y);
      y += 8;
    });

    doc.save("admin-report.pdf");
  };

  return (
    <main className="min-h-screen">
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Report</h1>
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="hover:text-blue-300">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <button onClick={downloadPdf} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded cursor-pointer">
            Download PDF
          </button>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Top 3 Most Popular Venues</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topVenues}>
              <XAxis dataKey="venueName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#1e293b" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {topVenues.map((v: any, i: number) => (
              <p key={i} className="text-sm text-slate-700">
                <span className="font-semibold">{v.venueName}</span> - {v.bookings} bookings, most popular on {v.popularDay}, slot {v.popularTimeSlot}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Top 3 Most Active Applicants</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topApplicants}>
              <XAxis dataKey="applicantName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalApplications" fill="#2563eb" />
              <Bar dataKey="successfulBookings" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {topApplicants.map((a: any, i: number) => (
              <p key={i} className="text-sm text-slate-700">
                <span className="font-semibold">{a.applicantName}</span> - {a.successfulBookings} successful out of {a.totalApplications} applications
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
