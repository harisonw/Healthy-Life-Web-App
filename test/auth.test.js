const app = require("../server.js").app;
const db = require("../server.js").db;
const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Auth", () => {
  // before all tests, connect to the database and delete user with email John@test.com
  beforeAll(async () => {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteOne({ email: "John@test.com" });
  });

  describe("register", () => {
    it('should register a new user and return with message "User added successfully!"', async () => {
      const res = await request(app).post("/api/user/register").send({
        fname: "John",
        email: "John@test.com",
        password: "12345678",
        newsletter: true,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "User added successfully!");
    });

    it('should not register a new user with the same email and return with message "User already exists!"', async () => {
      const res = await request(app).post("/api/user/register").send({
        fname: "John",
        email: "John@test.com",
        password: "12345678",
        newsletter: true,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email already exists!");
    });

    it('should not register a new user with missing fields and return with message "User validation failed"', async () => {
      const res = await request(app).post("/api/user/register").send({
        email: "John@test.com",
        password: "12345678",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "User validation failed");
    });
  });

  describe("login", () => {
    it('should login a user and return with message "Login successful!"', async () => {
      const res = await request(app).post("/api/user/login").send({
        email: "John@test.com",
        password: "12345678",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Login successful!");
    });

    it('should not login a user with wrong password and return with message "Wrong password!"', async () => {
      const res = await request(app).post("/api/user/login").send({
        email: "John@test.com",
        password: "123456789",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "error",
        "No User found with this email or Password for the user is incorrect!"
      );
    });

    it('should not login a user with wrong email and return with message "No User found with this email or Password for the user is incorrect!"', async () => {
      const res = await request(app).post("/api/user/login").send({
        email: "John5@test.com",
        password: "12345678",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "error",
        "No User found with this email or Password for the user is incorrect!"
      );
    });
  });
});
