import "reflect-metadata";
import * as dotenv from "dotenv";

dotenv.config();

import {DataSource, DataSourceOptions} from "typeorm";
import { User } from "./entities/User";
import { Venue } from "./entities/Venue";
import { BookingApplication } from "./entities/BookingApplication";
import { BlockedTimeSlot } from "./entities/BlockedTimeSlot";
import { VendorComment } from "./entities/VendorComment";
import { HirerDocument } from "./entities/HirerDocument";
import { HiringHistory } from "./entities/HiringHistory";

const isTesting = process.env.NODE_ENV === "test";

const entities = [User, Venue, BookingApplication, BlockedTimeSlot, VendorComment, HirerDocument, HiringHistory];

const sqliteConfig: DataSourceOptions = {
    type: "better-sqlite3",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities,
};

const mssqlConfig: DataSourceOptions = {
    type: "mssql",
     host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
    port: 1433,
    username: "s4075255",
    password: "nipuna2019#",
    database: "s4075255",
    synchronize: true,
    logging: true,
    entities,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export const AppDataSource = new DataSource(isTesting ? sqliteConfig : mssqlConfig);
