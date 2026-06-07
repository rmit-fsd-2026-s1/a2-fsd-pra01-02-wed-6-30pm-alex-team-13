import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";
import { User } from "../entities/User";
import { BookingApplication } from "../entities/BookingApplication";

const venueRepository = AppDataSource.getRepository(Venue);
const userRepository = AppDataSource.getRepository(User);
const bookingRepository = AppDataSource.getRepository(BookingApplication);

function dayOfWeek(dateString: string){
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(dateString);
    if(isNaN(d.getTime())) return "Unknown";
    return days[d.getDay()];
}

function mostCommon(list: string[]){
    let best = "N/A";
    let bestCount = 0;
    for(const item of list){
        let count = 0;
        for(const other of list){
            if(other === item) count++;
        }
        if(count > bestCount){
            bestCount = count;
            best = item;
        }
    }
    return best;
}

export const resolvers = {
    Query: {
        venues: async () => {
            return await venueRepository.find({ relations: { vendor: true } });
        },

        vendors: async () => {
            return await userRepository.find({ where: { role: "vendor" } });
        },

        topVenues: async () => {
            const bookings = await bookingRepository.find({ relations: { venue: true } });

            const venueStats: any = {};

            for (const booking of bookings){
                const name = booking.venue ? booking.venue.name : "Unknown";
                if(!venueStats[name]){
                    venueStats[name] = { count: 0, days: [], slots: [] };
                }
                venueStats[name].count += 1;
                venueStats[name].days.push(dayOfWeek(booking.eventDate));
                venueStats[name].slots.push(`${booking.startTime} - ${booking.endTime}`);
            }

            const result = [];
            for(const name in venueStats){
                const stat = venueStats[name];
                result.push({
                    venueName: name,
                    bookings: stat.count,
                    popularDay: mostCommon(stat.days),
                    popularTimeSlot: mostCommon(stat.slots)
                });
            }

            result.sort((a, b) => b.bookings - a.bookings);
            return result.slice(0, 3);
        },

        topApplicants: async () => {
            const bookings = await bookingRepository.find({ relations: { hirer: true } });

            const applicantStats: any = {};

            for (const booking of bookings){
                const name = booking.hirer ? `${booking.hirer.firstName} ${booking.hirer.lastName}` : "Unknown";
                if(!applicantStats[name]){
                    applicantStats[name] = { total: 0, successful: 0 };
                }
                applicantStats[name].total += 1;
                if(booking.status === "Approved"){
                    applicantStats[name].successful += 1;
                }
            }

            const result = [];
            for(const name in applicantStats){
                result.push({
                    applicantName: name,
                    successfulBookings: applicantStats[name].successful,
                    totalApplications: applicantStats[name].total
                });
            }

            result.sort((a, b) => b.successfulBookings - a.successfulBookings);
            return result.slice(0, 3);
        }
    },

    Mutation: {
        adminLogin: (_: any, args: { username: string; password: string }) => {
            if(args.username === "admin" && args.password === "admin"){
                return { success: true, message: "Login successful" };
            }
            return { success: false, message: "Invalid admin credentials" };
        },

        createVenue: async (_: any, args: any) => {
            let vendor = undefined;
            if(args.vendorId){
                vendor = await userRepository.findOne({ where: { id: args.vendorId, role: "vendor" } });
            }

            const venue = venueRepository.create({
                name: args.name,
                Location: args.Location,
                capacity: args.capacity,
                price: args.price,
                imageUrl: args.imageUrl,
                description: args.description,
                suitabilityKeywords: args.suitabilityKeywords,
                vendor: vendor || undefined
            });

            await venueRepository.save(venue);
            return venue;
        },

        updateVenue: async (_: any, args: any) => {
            const venue = await venueRepository.findOne({ where: { id: args.id }, relations: { vendor: true } });
            if(!venue) throw new Error("Venue not found");

            if(args.name !== undefined) venue.name = args.name;
            if(args.Location !== undefined) venue.Location = args.Location;
            if(args.capacity !== undefined) venue.capacity = args.capacity;
            if(args.price !== undefined) venue.price = args.price;
            if(args.imageUrl !== undefined) venue.imageUrl = args.imageUrl;
            if(args.description !== undefined) venue.description = args.description;
            if(args.suitabilityKeywords !== undefined) venue.suitabilityKeywords = args.suitabilityKeywords;

            await venueRepository.save(venue);
            return venue;
        },

        deleteVenue: async (_: any, args: { id: number }) => {
            const venue = await venueRepository.findOne({ where: { id: args.id } });
            if(!venue) throw new Error("Venue not found");
            await venueRepository.remove(venue);
            return true;
        },

        assignVendor: async (_: any, args: { venueId: number; vendorId: number }) => {
            const venue = await venueRepository.findOne({ where: { id: args.venueId }, relations: { vendor: true } });
            if(!venue) throw new Error("Venue not found");

            const vendor = await userRepository.findOne({ where: { id: args.vendorId, role: "vendor" } });
            if(!vendor) throw new Error("Vendor not found");

            venue.vendor = vendor;
            await venueRepository.save(venue);
            return venue;
        },

        setFeatured: async (_: any, args: { venueId: number; featured: boolean }) => {
            const venue = await venueRepository.findOne({ where: { id: args.venueId }, relations: { vendor: true } });
            if(!venue) throw new Error("Venue not found");

            venue.featured = args.featured;
            await venueRepository.save(venue);
            return venue;
        }
    }
};
