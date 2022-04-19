import express, { Application, RequestHandler } from "express";
import Server from "./typings/Server";
import Controller from "./typings/Controller";
import db from "./models/index";
import AuthController from "./controllers/AuthController";
import TokenController from "./controllers/TokenController";
import { json, urlencoded } from "body-parser";
import { PORT } from "./config";
import UserService from "./services/UserService";

const app: Application = express();
const server: Server = new Server(app, db.sequelize, PORT);

const controllers: Array<Controller> = [
  new AuthController(UserService, db),
  new TokenController(),
];

const globalMiddleware: Array<RequestHandler> = [
  urlencoded({ extended: false }),
  json(),
];

process.on("unhandledRejection", (error: Error) => {
  throw error;
});

Promise.resolve()
  .then(() => server.initDatabase())
  .then(() => {
    server.loadMiddleware(globalMiddleware);
    server.loadControllers(controllers);
    server.run();
  });
