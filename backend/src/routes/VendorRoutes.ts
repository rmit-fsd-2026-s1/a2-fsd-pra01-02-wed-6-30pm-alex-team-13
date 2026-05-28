import {Router} from 'express';
import {AppDataSource} from '../data-source';
import {BookingApplication} from '../entities/BookingApplication';

const router = Router();

const bookingRepository = AppDataSource.getRepository(BookingApplication);
router.get("/:vendorID/applications",
    async (req, res) => {
        try{
            const vendorID = Number(req.params.vendorID);

            const applications = await bookingRepository.find({
                relations: {
                    hirer: true,
                    venue: true
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

router.patch("/applications/:id/status", async (req, res) => {
    try{
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
export default router;
