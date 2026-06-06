import {
    isValidApplicationStatus,
    isValidBlockedTimeSlot,
    isValidVenueInput
} from "../src/utils/validation";

describe("Vendor backend validation unit tests", () => {

    // Test 1: Checks that valid booking statuses used by vendors are accepted.
    test("accepts valid application statuses", () => {
        expect(isValidApplicationStatus("Pending")).toBe(true);
        expect(isValidApplicationStatus("Approved")).toBe(true);
        expect(isValidApplicationStatus("Rejected")).toBe(true);
    });

    // Test 2: Checks that invalid statuses cannot be used for booking applications.
    test("rejects invalid application statuses", () => {
        expect(isValidApplicationStatus("Cancelled")).toBe(false);
        expect(isValidApplicationStatus("Testing")).toBe(false);
    });

    // Test 3: Checks that a valid blocked timeslot is accepted.
    test("accepts valid blocked time slot input", () => {
        expect(
            isValidBlockedTimeSlot(
                "2026-12-20T17:00:00",
                "2026-12-20T23:00:00",
                "Private event"
            )
        ).toBe(true);
    });

    // Test 4: Checks that blocked timeslots cannot end before they start.
    test("rejects blocked time slot where end time is before start time", () => {
        expect(
            isValidBlockedTimeSlot(
                "2026-12-20T23:00:00",
                "2026-12-20T17:00:00",
                "Private event"
            )
        ).toBe(false);
    });

    // Test 5: Checks that complete venue details are accepted before venue creation/update.
    test("accepts valid venue input", () => {
        expect(
            isValidVenueInput({
                name: "Skyline Rooftop",
                Location: "Melbourne CBD",
                capacity: 120,
                price: 3500,
                description: "Modern rooftop venue."
            })
        ).toBe(true);
    });

    // Test 6: Checks that incomplete venue details are rejected before database operations.
    test("rejects invalid venue input with missing required data", () => {
        expect(
            isValidVenueInput({
                name: "",
                Location: "Melbourne CBD",
                capacity: 0,
                price: 3500,
                description: "Modern rooftop venue."
            })
        ).toBe(false);
    });
});