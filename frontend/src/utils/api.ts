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

export async function getApplicants() {
    try {
        const response = await fetch(
            "http://localhost:3001/vendor/1/applications"
        );

        const data = await response.json();

        return data;

    } catch (err) {
        console.error("Error fetching applicants:", err);

        return [];
    }
}

export async function updateApplicantStatus(id: string, status: "Approved" | "Rejected") {
    try{
        const response = await fetch(
            `http://localhost:3001/vendor/1/applications/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status }),
            }
        );

        return await response.json();
    } catch (error){
        console.log(error);
        return null;
    }
}

export async function saveComment(
    applicationId: string,
    comment: string
) {
    try {

        const response = await fetch(
            `http://localhost:3001/vendor/1/applications/${applicationId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comment }),
            }
        );

        return await response.json();

    } catch(error){

        console.log(error);

        return null;
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

export async function saveBlockedTimeSlot(
    venueId: number,
    startDateTime: string,
    endDateTime: string,
    reason: string
){
    try{
        const response = await fetch(`http://localhost:3001/vendor/1/venues/${venueId}/blocked-timeslots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ startDateTime, endDateTime, reason }),
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getBlockedTimeSlots(venueId: number) {
    try{
        const response = await fetch(`http://localhost:3001/vendor/1/venues/${venueId}/blocked-timeslots`);

        return await response.json();
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function deleteBlockedTimeSlot(venueId: number, blockedSlotId: number) {
    try{
        const response = await fetch(`http://localhost:3001/vendor/1/venues/${venueId}/blocked-timeslots/${blockedSlotId}`,
            {
                method: "DELETE",
            }
        );
        return await response.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}