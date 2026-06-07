import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

describe("Auth Routes", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository(User).clear();
    });

    // Test 1: a valid signup with a strong password should create the user and return it without the password
    it("signs up a new user with a strong password", async () => {
        const response = await request(app).post("/auth/signup").send({
            firstName: "Test",
            lastName: "Hirer",
            email: "test@hirer.com",
            password: "Password1!",
            confirmPassword: "Password1!",
            role: "hirer"
        });

        expect(response.status).toBe(201);
        expect(response.body.email).toBe("test@hirer.com");
        expect(response.body.password).toBeUndefined();
    });

    // Test 2: signup should be rejected when the password is weak (no uppercase, number or symbol)
    it("rejects signup when the password is weak", async () => {
        const response = await request(app).post("/auth/signup").send({
            firstName: "Test",
            lastName: "Hirer",
            email: "weak@hirer.com",
            password: "password",
            confirmPassword: "password",
            role: "hirer"
        });

        expect(response.status).toBe(400);
    });

    // Test 3: signin should succeed with correct details and fail with a wrong password
    it("signs in with correct details and fails with a wrong password", async () => {
        await request(app).post("/auth/signup").send({
            firstName: "Login",
            lastName: "User",
            email: "login@test.com",
            password: "Password1!",
            confirmPassword: "Password1!",
            role: "vendor"
        });

        const good = await request(app).post("/auth/signin").send({
            email: "login@test.com",
            password: "Password1!"
        });
        expect(good.status).toBe(200);
        expect(good.body.role).toBe("vendor");

        const bad = await request(app).post("/auth/signin").send({
            email: "login@test.com",
            password: "WrongPass1!"
        });
        expect(bad.status).toBe(401);
    });
});
