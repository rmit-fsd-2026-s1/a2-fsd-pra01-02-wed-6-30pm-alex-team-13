export type BlockedPeriod = {
    id: string;
    venueName: string;
    startDateTime: string;
    endDateTime: string;
    reason: string;
};

export type HireHistory = {
    venueName: string;
    location: string;
    event: string;
    dateHired: string;
    rating: number;
};

export type CompliantDocs = {
    License: boolean;
    liabilityInsuarance: boolean;
    businessRegistration: boolean;
};

export type Applicant = {
    id: string;
    name: string;
    email: string;
    phone: string;
    eventName: string;
    eventType: string;
    guests: number;
    eventDate: string;
    durationHours: number;
    venueOfChoice: string;
    suitability: "High" | "Medium" | "Low";
    reputationScore: number;
    compliantDocs: CompliantDocs;
    hireHistory: HireHistory[];
    comments: string;
    selected: boolean;
    approved: boolean;
    status: "Pending" | "Approved" | "Rejected";
    timesChosen: number;
};