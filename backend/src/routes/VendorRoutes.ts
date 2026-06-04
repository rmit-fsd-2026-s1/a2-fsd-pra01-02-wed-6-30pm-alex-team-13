import {Router} from 'express';
import {AppDataSource} from '../data-source';
import {BookingApplication} from '../entities/BookingApplication';
import {User} from '../entities/User';
import {VendorComment} from '../entities/VendorComment';
import {BlockedTimeSlot} from '../entities/BlockedTimeSlot';
import {Venue} from '../entities/Venue';

const router = Router();

const commentRepository = AppDataSource.getRepository(VendorComment);
const userRepository = AppDataSource.getRepository(User);
const blockedTimeSlotRepository = AppDataSource.getRepository(BlockedTimeSlot);
const venueRepository = AppDataSource.getRepository(Venue);

const bookingRepository = AppDataSource.getRepository(BookingApplication);
router.get("/test", (req, res) => {
    res.json({ message: "vendor routes working" });
});

router.get("/:vendorID/applications",
    async (req, res) => {
        try{
            const vendorID = Number(req.params.vendorID);

            const applications = await bookingRepository.find({
                relations: {
                    hirer: true,
                    venue: true,
                    comments: true
                },
                where: {
                    venue: {
                        vendor: {
                            id: vendorID
                        }
                    }
                }
            });

            res.json(applications);
        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);

router.patch("/:vendorID/applications/:id/status", async (req, res) => {
    try{
        const vendorID = Number(req.params.vendorID);
        const applicationID = Number(req.params.id);
        const { status } = req.body;

        if(!["Pending", "Approved", "Rejected"].includes(status)){
            return res.status(400).json({message: "Invalid status"});
        }

        const application = await bookingRepository.findOne({
            where: { id: applicationID },
            relations: {
                hirer: true,
                venue: true,
                comments: true
            },
        });

        if(!application){
            return res.status(404).json({message: "Application not found"});
        }

        application.status = status;

        if(status === "Approved"){
            application.reputationScore += 1;
        }

        const savedApplication = await bookingRepository.save(application);

        res.json(savedApplication);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.post("/:vendorID/applications/:id/comments", async (req, res) => {
    try{
        const vendorID = Number(req.params.vendorID);
        const applicationID = Number(req.params.id);

        const {comment} = req.body;

        const application = await bookingRepository.findOne({
            where: { id: applicationID }
        });

        if(!application){
            return res.status(404).json({message: "Application not found"});
        }

        //temp vendor
        const vendor = await userRepository.findOne({
            where:{
                id: vendorID,
                role: "vendor"
            }
        });

        if(!vendor){
            return res.status(404).json({message: "Vendor not found"});
        }

        const newComment = commentRepository.create({
            comment,
            application,
            vendor
        });

        await commentRepository.save(newComment);

        res.status(201).json(newComment);
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.post("/:vendorID/venues/:venueID/blocked-timeslots", async (req, res) => {
    try{
        const vendorID = Number(req.params.vendorID);
        const venueID = Number(req.params.venueID);

        const { startDateTime, endDateTime, reason } = req.body;

        if(!startDateTime || !endDateTime){
            return res.status(400).json({message: "Start and end date time are required"});
        }

        if(
            new Date(endDateTime) <= new Date(startDateTime)
        ){
            return res.status(400).json({message: "End date time must be after start date time"});
        }

        if(!reason.trim()){
            return res.status(400).json({message: "Reason for blocking is required"});
        }

        const venue = await venueRepository.findOne({
            where:{
                id: venueID,
                vendor: {
                    id: vendorID
                }
            },
            relations: {
                vendor: true
            }
        });

        if(!venue){
            return res.status(404).json({message: "Venue not found."});
        }

        const blockedTimeSlot = blockedTimeSlotRepository.create({
            startDateTime,
            endDateTime,
            reason,
            venue
        });

        await blockedTimeSlotRepository.save(blockedTimeSlot);
        res.status(201).json(blockedTimeSlot);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/:vendorID/venues/:venueID/blocked-timeslots", async (req, res) => {
    try{
        const vendorId = Number(req.params.vendorID);
        const venueId = Number(req.params.venueID);

        const blockedSlots = await blockedTimeSlotRepository.find({
            where: {
                venue: {
                    id: venueId,
                    vendor: {
                        id: vendorId
                    }
                }
            },
            relations: {
                venue: {
                    vendor: true
                }
            }
        });

        res.json(blockedSlots);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.delete("/:vendorID/venues/:venueID/blocked-timeslots/:id", async (req, res) => {
    try{
        const vendorID = Number(req.params.vendorID);
        const venueID = Number(req.params.venueID);
        const blockedTimeSlotID = Number(req.params.id);

        const blockedSlot = await blockedTimeSlotRepository.findOne({
            where: {
                id: blockedTimeSlotID,
                venue: {
                    id: venueID,
                    vendor: {
                        id: vendorID
                    }
                }
            },
            relations: {
                venue: {
                    vendor: true
                }
            }
        });

        if(!blockedSlot){
            return res.status(404).json({
                message: "Blocked time slot not found"
            });
        }

        await blockedTimeSlotRepository.remove(blockedSlot);
        res.json({message: "Blocked period deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

export default router;
