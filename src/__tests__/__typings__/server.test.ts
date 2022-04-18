import express from "express";
import { Sequelize } from "sequelize";
import AuthController from "../../controllers/AuthController";
import UserService from "../../services/UserService";
import Server from "../../typings/Server";

jest.mock("sequelize", () => {
  const mockSequelize = {
    authenticate: jest.fn(),
    define: jest.fn(),
  };
  const actualSequelize = jest.requireActual("sequelize");
  return {
    Sequelize: jest.fn(() => mockSequelize),
    DataTypes: actualSequelize.DataTypes,
  };
});

jest.mock("express", () => {
  return () => ({
    listen: jest.fn(),
    use: jest.fn(),
  });
});

jest.mock("../../controllers/AuthController", () => {
  return jest.fn().mockImplementation(() => {
    return {
      path: "path",
      setRoutes: jest.fn().mockImplementation(() => "router"),
    };
  });
});

jest.mock("../../services/UserService", () => {
  return () => ({
    UserService: jest.fn(),
  });
});

describe("testing server class", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  const app = express();
  const mockSequelizeContext = new Sequelize();
  const server: Server = new Server(app, mockSequelizeContext, 8081);
  describe("testing initDatabase method", () => {
    it("should call db.authenticate", () => {
      server.initDatabase();
      expect(mockSequelizeContext.authenticate).toHaveBeenCalled();
    });
  });

  describe("testing loadControllers method", () => {
    const authController = new AuthController(UserService);
    const controllers = [authController];
    it("should call app.use", () => {
      server.loadControllers(controllers);
      expect(app.use).toHaveBeenCalled();
    });

    it("should call app.use with controller path and setRoutes", () => {
      server.loadControllers(controllers);
      expect(app.use).toHaveBeenCalledWith(
        authController.path,
        authController.setRoutes()
      );
    });
  });

  describe("testing loadMiddleware method", () => {
    const mockMiddleware = () => jest.fn((req, res, next) => next());
    const middlewares = [mockMiddleware];

    it("should call app.use", () => {
      server.loadMiddleware(middlewares);
      expect(app.use).toHaveBeenCalled();
    });

    it("should call app.use with middleware", () => {
      server.loadMiddleware(middlewares);
      expect(app.use).toHaveBeenCalledWith(middlewares[0]);
    });
  });

  describe("testing run method", () => {
    it("should call app.listen", () => {
      server.run();
      expect(app.listen).toHaveBeenCalled();
    });

    it("should call app.listen with port", () => {
      server.run();
      expect(app.listen).toHaveBeenCalledWith(8081, expect.anything());
    });
  });
});
