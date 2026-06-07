import "reflect-metadata";
import * as dotenv from "dotenv";

dotenv.config();

import {DataSource} from "typeorm";
import { User } from "./entities/User";
import { Venue } from "./entities/Venue";
import { BookingApplication } from "./entities/BookingApplication";
import { BlockedTimeSlot } from "./entities/BlockedTimeSlot";
import { VendorComment } from "./entities/VendorComment";
import { HirerDocument } from "./entities/HirerDocument";
import { HiringHistory } from "./entities/HiringHistory";

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    synchronize: true,
    logging: false,

    entities: [User, Venue, BookingApplication, BlockedTimeSlot, VendorComment, HirerDocument, HiringHistory],

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
});
