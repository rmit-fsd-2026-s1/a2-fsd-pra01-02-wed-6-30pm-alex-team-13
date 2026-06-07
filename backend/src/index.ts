import app from "./app";
import bcrypt from "bcryptjs";
import {User} from "./entities/User";
import {Venue} from "./entities/Venue";
import {BookingApplication} from "./entities/BookingApplication";
import {AppDataSource} from "./data-source";

// All test usernames and passwords are listed in Users.txt.
// h@test.com (hirer) and v@test.com (vendor) were the main accounts used for testing.

AppDataSource.initialize().then(async () => {
    console.log("Database Connected");
    const userRepository = AppDataSource.getRepository(User);
    const venueRepository = AppDataSource.getRepository(Venue);
    const bookingRepository = AppDataSource.getRepository(BookingApplication);

    const existingUsers = await userRepository.find();
    if(existingUsers.length === 0) {
        const vendor = userRepository.create({
            firstName: "John",
            lastName: "Vendor",
            email: "v@test.com",
            password: await bcrypt.hash("password", 10),
            role: "vendor",
        });

        await userRepository.save(vendor);

        const hirer = userRepository.create({
            firstName: "Jane",
            lastName: "Hirer",
            email: "h@test.com",
            password: await bcrypt.hash("password", 10),
            role: "hirer"
        });

        await userRepository.save(hirer);

        const venue = venueRepository.create({
            name: "Grand Ballroom",
            Location: "Melbourne",
            capacity: 300,
            price: 5000,
            imageUrl: "/images/photo1.jpg",
            description: "Large event venue",
            suitabilityKeywords: "weddings, conferences",
            vendor
        });
        await venueRepository.save(venue);

        const application = bookingRepository.create({
            eventName: "Smith-Jones Wedding",
            guestCount: 150,
            eventDate: "2026-12-15",
            startTime: "17:00",
            endTime: "23:00",
            status: "Pending",
            reputationScore: 95,
            hirer,
            venue
        });
        await bookingRepository.save(application);

        console.log("Sample data created");
    }

    app.listen(3001, () => {
        console.log("Server running on 3001");
    });

}).catch((error) => {console.log(error)});
