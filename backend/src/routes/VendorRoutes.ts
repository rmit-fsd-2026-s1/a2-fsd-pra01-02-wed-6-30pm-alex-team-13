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

export default router;
