import "reflect-metadata";

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
    host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
    port: 1433,
    username: "s4075255",
    password: "Nipuna2019#",
    database: "s4075255",

    synchronize: true,
    logging: true,

    entities: [User, Venue, BookingApplication, BlockedTimeSlot, VendorComment, HirerDocument, HiringHistory],

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
});