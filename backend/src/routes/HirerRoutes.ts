import {Router} from 'express';
import {AppDataSource} from '../data-source';
import {Venue} from '../entities/Venue';
import {User} from '../entities/User';
import {BookingApplication} from '../entities/BookingApplication';

const router = Router();

const venueRepository = AppDataSource.getRepository(Venue);
const userRepository = AppDataSource.getRepository(User);
const bookingRepository = AppDataSource.getRepository(BookingApplication);

router.get("/venues", async (req, res) => {
    try{
        const venues = await venueRepository.find();
        res.json(venues);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/:hirerID/applications", async (req, res) => {
    try{
        const hirerID = Number(req.params.hirerID);

        const applications = await bookingRepository.find({
            relations: {
                venue: true
            },
            where: {
                hirer: {
                    id: hirerID
                }
            }
        });

        res.json(applications);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.post("/:hirerID/applications", async (req, res) => {
    try{
        const hirerID = Number(req.params.hirerID);

        const {eventName, guestCount, eventDate, startTime, endTime, venueId} = req.body;

        if(!eventName || !guestCount || !eventDate || !startTime || !endTime || !venueId){
            return res.status(400).json({message: "All fields are required"});
        }

        if(Number(guestCount) <= 0){
            return res.status(400).json({message: "Guest count must be at least 1"});
        }

        if(endTime <= startTime){
            return res.status(400).json({message: "End time must be after start time"});
        }

        const hirer = await userRepository.findOne({
            where: {
                id: hirerID,
                role: "hirer"
            }
        });

        if(!hirer){
            return res.status(404).json({message: "Hirer not found"});
        }

        const venue = await venueRepository.findOne({where: {id: Number(venueId)}});

        if(!venue){
            return res.status(404).json({message: "Venue not found"});
        }

        const application = bookingRepository.create({
            eventName,
            guestCount,
            eventDate,
            startTime,
            endTime,
            status: "Pending",
            hirer,
            venue
        });

        await bookingRepository.save(application);

        res.status(201).json(application);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

export default router;
