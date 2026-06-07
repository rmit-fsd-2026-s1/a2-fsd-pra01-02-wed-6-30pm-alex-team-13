import "@jest/globals";
import { AppDataSource } from "../data-source";
import { afterAll, beforeAll } from "@jest/globals";

process.env.NODE_ENV = "test";

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});
