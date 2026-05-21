import { Applicant, BlockedPeriod } from "@/types";
import { seedApplicants } from "@/data/seedApplicants";
import { seedBlockedPeriods } from "@/data/seedBlockedPeriods";

const APPLICANT_DATA_KEY = "venue_vendors_applicants";
const BLOCKED_DATES_KEY = "venue_vendors_blocked";

const isClient = typeof window !== "undefined";

export function initialiseApplicants() {
    initialiseStorage();
}

export function initialiseBlockedPeriods() {
    if (typeof window === "undefined") return;

    const existing = localStorage.getItem(BLOCKED_DATES_KEY);

    if (!existing) {
        localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify([]));
    }
}

export function initialiseStorage() {
    if (!isClient) return;

    console.log("Checking local storage for existing data...");

    if (!localStorage.getItem(APPLICANT_DATA_KEY)) {
        console.log("No applicants found. Loading seed data...");
        localStorage.setItem(APPLICANT_DATA_KEY, JSON.stringify(seedApplicants));
    }

    if (!localStorage.getItem(BLOCKED_DATES_KEY)) {
        console.log("No blocked dates found. Loading seed data...");
        localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(seedBlockedPeriods));
    }
}

export function getApplicants(): Applicant[] {
    if (!isClient) return [];

    const rawData = localStorage.getItem(APPLICANT_DATA_KEY);
    if (!rawData) return [];
    
    try {
        return JSON.parse(rawData);
    } catch (err) {
        console.error("Error parsing applicant data:", err);
        return [];
    }
}

export function saveApplicants(applicants: Applicant[]) {
    if (!isClient) return;
    localStorage.setItem(APPLICANT_DATA_KEY, JSON.stringify(applicants));
    console.log("Applicants list updated in storage.");
}

export function getBlockedPeriods(): BlockedPeriod[] {
    if (!isClient) return [];

    const data = localStorage.getItem(BLOCKED_DATES_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveBlockedPeriods(periods: BlockedPeriod[]) {
    if (!isClient) return;
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(periods));
    console.log("Blocked periods saved.");
}