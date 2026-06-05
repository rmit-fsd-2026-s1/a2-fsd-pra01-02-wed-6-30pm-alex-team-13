"use client";

import { useState } from "react";
import {Applicant} from "@/types";
import{
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";

export default function Insights({applicants}: {applicants: Applicant[]}) {
    const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");

    if(applicants.length === 0){
        return null;
    }

    const approvedApplicants = applicants.filter((applicant) => applicant.status === "Approved");

    const hirerTallies = approvedApplicants.reduce((acc: any, applicant) => {
        acc[applicant.name] = (acc[applicant.name] || 0) + 1;
        return acc;
    }, {});

    const hirerChartData = Object.keys(hirerTallies).map((name) => ({
        name,
        bookings: hirerTallies[name],
    }));

    const sortedHirers = [...hirerChartData].sort(
        (a, b) => b.bookings - a.bookings
    );

    const mostActive = sortedHirers[0];
    const leastActive = sortedHirers.length > 1 ? sortedHirers[sortedHirers.length - 1] : null;

    const venueTallies = approvedApplicants.reduce((acc: any, applicant) => {
        const venue = applicant.venueOfChoice;
        const hirer = applicant.name;

        if(!acc[venue]) acc[venue] = {venue};
        acc[venue][hirer] = (acc[venue][hirer] || 0) + 1;

        return acc;
    }, {});

    const stackedData = Object.values(venueTallies);

    const utilizationData = approvedApplicants.filter((applicant) => {
        const eventDate = new Date(applicant.eventDate);
        const now = new Date();

        if (timeFilter === "week"){
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return eventDate >= sevenDaysAgo;
        }

        if (timeFilter === "month"){
            return (
                eventDate.getMonth() === now.getMonth() &&
                eventDate.getFullYear() === now.getFullYear()
            );
        }

        return true;
    })
    .reduce((acc: any, applicant) => {
        const data = applicant.eventDate;
        acc[data] = (acc[data] || 0) + 1;
        return acc;
    }, {});

    const lineData = Object.keys(utilizationData).map((date) => ({
        date,
        bookings: utilizationData[date],
    }));

    const hirerNames = Object.keys(hirerTallies);

    const chartColors = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

    return(
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
                Vendor Insights
            </h3>

            <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div>
                    <h4 className="font-semibold mb-3">Hirer Tallies</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={hirerChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Venue Bookings by Hirer</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={stackedData as any[]}>
                            <XAxis dataKey="venue" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {hirerNames.map((name, index) => (
                                <Bar key={name} dataKey={name} stackId="a" 
                                 fill={index % 2 === 0 ? "#2563eb" : "#16a34a"}/>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">
                        Hirer Activity Share
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={hirerChartData}
                                dataKey="bookings"
                                nameKey="name"
                                label
                            >
                               {hirerChartData.map((_, index) => (
                                <Cell key={index}  fill={chartColors[index % chartColors.length]} />
                               ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Venue Utilisation Over Time</h4>

                    <div className="mb-3 flex gap-2">
                        <button onClick={() => setTimeFilter ("week")} className="rounded-md bg-slate-800 px-3 py-1 text-sm text-white">This Week</button>
                        <button onClick={() => setTimeFilter ("month")} className="rounded-md bg-slate-800 px-3 py-1 text-sm text-white">This Month</button>
                        <button onClick={() => setTimeFilter ("all")} className="rounded-md bg-slate-800 px-3 py-1 text-sm text-white">All Time</button>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="bookings" stroke="#2563eb" strokeWidth={3}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-green-100 p-4 text-slate-800">
                    <h4 className="font-semibold">
                        Most Active Hirer
                    </h4>
                    <p>{mostActive?.name}</p>
                    <p>{mostActive?.bookings} bookings</p>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4 text-slate-800">
                    <h4 className="font-semibold">
                        Least Active Hirer
                    </h4>
                    <p>{leastActive?.name}</p>
                    {leastActive ? (
                        <p>{leastActive?.bookings} bookings</p>
                    ) : (
                        <p>No other hirers</p>
                    )}
                </div>

            </div>
        </section>
    );
}