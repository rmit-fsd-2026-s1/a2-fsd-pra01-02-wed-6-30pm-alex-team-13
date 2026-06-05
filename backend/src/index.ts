import express from "express";
import cors from "cors";
import vendorRoutes from "./routes/VendorRoutes";
import {User} from "./entities/User";
import {Venue} from "./entities/Venue";
import {BookingApplication} from "./entities/BookingApplication";
import {AppDataSource} from "./data-source";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/vendor", vendorRoutes);

app.get("/", (req, res) => {
    res.send("Venue Vendor Backend Running");
});

app.get("/debug", (req, res) => {
  res.json({ message: "index route working" });
});

AppDataSource.initialize().then(async () => {
    console.log("Database Connected");
    const userRepository = AppDataSource.getRepository(User);
    const venueRepository = AppDataSource.getRepository(Venue);
    const bookingRepository = AppDataSource.getRepository(BookingApplication);  

    await bookingRepository.update(
        { id: 1 },
        { reputationScore: 95 }
    );
    
    const existingUsers = await userRepository.find();
    if(existingUsers.length === 0) {
        const vendor = userRepository.create({
            firstName: "John",
            lastName: "Vendor",
            email: "v@test.com",
            password: "password",
            role: "vendor",
        });

        await userRepository.save(vendor);

        const hirer = userRepository.create({
            firstName: "Jane",
            lastName: "Hirer",
            email: "J@test.com",
            password: "123456",
            role: "hirer"
        });

        await userRepository.save(hirer);

        const venue = venueRepository.create({
            name: "Grand Ballroom",
            Location: "Melbourne",
            capacity: 300,
            price: 5000,
            imageUrl: "ballroom.jpg",
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
    };

    const jackExists = await userRepository.findOne({
        where: {
            email: "jh@test.com"
        }
    });

    if (!jackExists) {
        const jack = userRepository.create({
            firstName: "Jack",
            lastName: "Hirer",
            email: "jh@test.com",
            password: "123456",
            role: "hirer"
        });

        await userRepository.save(jack);

        const grandBallroom = await venueRepository.findOne({
            where: {
                name: "Grand Ballroom"
            }
        });

        if (grandBallroom) {
            const application2 = bookingRepository.create({
                eventName: "Jones Wedding",
                guestCount: 150,
                eventDate: "2026-10-15",
                startTime: "17:00",
                endTime: "23:00",
                status: "Pending",
                reputationScore: 90,
                hirer: jack,
                venue: grandBallroom
            });

            await bookingRepository.save(application2);
        }
    }
    
    app.listen(3001, () => {
        console.log("Server running on 3001");
    });

}).catch((error) => {console.log(error)});