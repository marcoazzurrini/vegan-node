import request from "supertest";
import express from "express";
import Server from "../typings/Server";
import UserService from "../services/UserService";
import AuthController from "../controllers/AuthController";
import TokenController from "../controllers/TokenController";
import { json, urlencoded } from "body-parser";
import getMockDatabase, {
  UserModelMethodsInt,
} from "./testUtils/getMockDatabase";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";

const setup = async (userModelMethods?: UserModelMethodsInt) => {
  const app = express();
  try {
    const db = getMockDatabase(userModelMethods);
    const server: Server = new Server(app, db.sequelize, 8080);

    const controllers = [
      new AuthController(UserService, db),
      new TokenController(),
    ];
    const globalMiddleware = [urlencoded({ extended: false }), json()];

    await server.initDatabase();
    server.loadMiddleware(globalMiddleware);
    server.loadControllers(controllers);
  } catch (err) {
    console.log(err);
  }
  return { app };
};

describe("testing routes", () => {
  describe("testing login route", () => {
    it("should return 200 if credentials are correct", async () => {
      const hashedPassword = await hash("password", 10);
      const findOne = {
        username: "username",
        password: hashedPassword,
        id: "id",
      };
      const { app } = await setup({ findOne });
      const res = await request(app)
        .post("/user/login")
        .send({ username: "username", password: "password" });

      expect(res.statusCode).toBe(200);
    });

    it("should return 401 if user not found in db", async () => {
      const { app } = await setup({ findOne: null });
      const res = await request(app)
        .post("/user/login")
        .send({ username: "username", password: "password" });

      expect(res.statusCode).toBe(404);
    });

    it("should return 401 if password is not matching", async () => {
      const findOne = {
        username: "username",
        password: "password_a",
        id: "id",
      };
      const { app } = await setup({ findOne });
      const res = await request(app)
        .post("/user/login")
        .send({ username: "username", password: "password" });

      expect(res.statusCode).toBe(404);
    });
  });
  describe("testing /user/register", () => {
    it("should return 201 if user is created", async () => {
      const user = { id: "id", username: "username", password: "password" };
      const { app } = await setup({ findOne: null, create: user });
      const res = await request(app)
        .post("/user/register")
        .send({ username: "username", password: "password" });

      expect(res.statusCode).toBe(201);
    });

    it("should return 404 if user already exists", async () => {
      // const user = { id: "id", username: "username", password: "password" };
      const { app } = await setup({ findOne: {} });
      const res = await request(app)
        .post("/user/register")
        .send({ username: "username", password: "password" });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("testing /user/deleteUser", () => {
    it("should return 401 if no token is provided", async () => {
      const { app } = await setup({ destroy: 1 });
      const res = await request(app)
        .delete("/user/delete")
        .query({ username: "username", password: "password" });
      expect(res.statusCode).toBe(401);
    });

    it("should return 200 if user is deleted", async () => {
      const user = { id: "id", username: "username", password: "password" };
      const token = sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      const { app } = await setup({ destroy: 1 });
      const res = await request(app)
        .delete("/user/delete")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "username", password: "password", id: "id" });

      expect(res.statusCode).toBe(200);
    });

    it("should return 404 if user doesn't exist", async () => {
      const user = { id: "id", username: "username", password: "password" };
      const token = sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      const { app } = await setup({ destroy: 0 });
      const res = await request(app)
        .delete("/user/delete")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "username", password: "password", id: "id" });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("testing user/changePassword", () => {
    it("should return 401 if no token is provided", async () => {
      const { app } = await setup({ destroy: 1 });
      const res = await request(app)
        .delete("/user/update_password")
        .query({ username: "username", password: "password" });
      expect(res.statusCode).toBe(401);
    });

    it("should return 200 if password is updated", async () => {
      const user = { id: "id", username: "username", password: "password" };
      const token = sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      const { app } = await setup({ destroy: 1 });
      const res = await request(app)
        .delete("/user/delete")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "username", password: "password", id: "id" });

      expect(res.statusCode).toBe(200);
    });

    it("should return 404 if no user is found", async () => {
      const user = { id: "id", username: "username", password: "password" };
      const token = sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      const { app } = await setup({ destroy: 0 });
      const res = await request(app)
        .delete("/user/delete")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "username", password: "password", id: "id" });

      expect(res.statusCode).toBe(404);
    });
  });
});
