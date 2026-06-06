export function isValidApplicationStatus(status: string) {
    return ["Pending", "Approved", "Rejected"].includes(status);
}

export function isValidBlockedTimeSlot(
    startDateTime: string,
    endDateTime: string,
    reason: string
) {
    if (!startDateTime || !endDateTime) return false;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
        return false;
    }

    if (!reason.trim()) return false;

    return true;
}

export function isValidVenueInput(venue: {
    name?: string;
    Location?: string;
    capacity?: number;
    price?: number;
    description?: string;
}) {
    if (!venue.name) return false;
    if (!venue.Location) return false;
    if (!venue.capacity || venue.capacity <= 0) return false;
    if (!venue.price || venue.price <= 0) return false;
    if (!venue.description) return false;

    return true;
}