import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Venue } from "../entities/Venue";
import { BookingApplication } from "../entities/BookingApplication";

async function seedVendorVenueHirer() {
    const userRepository = AppDataSource.getRepository(User);
    const venueRepository = AppDataSource.getRepository(Venue);

    const vendor = await userRepository.save(userRepository.create({
        firstName: "John", lastName: "Vendor", email: "vendor@test.com", password: "password", role: "vendor"
    }));

    const hirer = await userRepository.save(userRepository.create({
        firstName: "Jane", lastName: "Hirer", email: "hirer@test.com", password: "password", role: "hirer"
    }));

    const venue = await venueRepository.save(venueRepository.create({
        name: "Grand Hall", Location: "Melbourne", capacity: 200, price: 5000,
        imageUrl: "/images/photo1.jpg", description: "Test venue", suitabilityKeywords: "wedding", vendor
    }));

    return { vendor, hirer, venue };
}

describe("Booking Flow", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository(BookingApplication).clear();
        await AppDataSource.getRepository(Venue).clear();
        await AppDataSource.getRepository(User).clear();
    });

    // Test 4: a hirer should be able to make a booking on a venue and it is saved to the database
    it("lets a hirer create a booking for a venue", async () => {
        const { hirer, venue } = await seedVendorVenueHirer();

        const response = await request(app).post(`/hirer/${hirer.id}/applications`).send({
            eventName: "Birthday Party",
            guestCount: 50,
            eventDate: "2026-09-20",
            startTime: "18:00",
            endTime: "22:00",
            venueId: venue.id
        });

        expect(response.status).toBe(201);
        expect(response.body.eventName).toBe("Birthday Party");
        expect(response.body.status).toBe("Pending");
    });

    // Test 5: a booking should be rejected by backend validation when the end time is before the start time
    it("rejects a booking when end time is before start time", async () => {
        const { hirer, venue } = await seedVendorVenueHirer();

        const response = await request(app).post(`/hirer/${hirer.id}/applications`).send({
            eventName: "Bad Booking",
            guestCount: 50,
            eventDate: "2026-09-20",
            startTime: "22:00",
            endTime: "18:00",
            venueId: venue.id
        });

        expect(response.status).toBe(400);
    });

    // Test 6: a vendor should see the application on their venue and be able to approve it
    it("shows the application to the venue's vendor and lets them approve it", async () => {
        const { vendor, hirer, venue } = await seedVendorVenueHirer();

        const created = await request(app).post(`/hirer/${hirer.id}/applications`).send({
            eventName: "Wedding",
            guestCount: 100,
            eventDate: "2026-10-10",
            startTime: "16:00",
            endTime: "23:00",
            venueId: venue.id
        });

        const list = await request(app).get(`/vendor/${vendor.id}/applications`);
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const approved = await request(app)
            .patch(`/vendor/${vendor.id}/applications/${created.body.id}/status`)
            .send({ status: "Approved" });

        expect(approved.status).toBe(200);
        expect(approved.body.status).toBe("Approved");
    });
});
