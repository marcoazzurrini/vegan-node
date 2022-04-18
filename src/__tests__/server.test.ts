import { Application } from "express";
import AuthController from "../controllers/AuthController";
import Server from "../typings/Server";
import getMockDatabase from "./testUtils/getMockDatabase";
import getMockUserService from "./testUtils/getMockUserService";

const setup = () => {
  const use = jest.fn();
  const app = { use } as unknown as Application;
  const db = getMockDatabase();
  const { MockUserService } = getMockUserService();
  const authController = new AuthController(MockUserService, db);
  const server = new Server(app, db.sequelize, 8080);
  return { app, db, server, authController, use };
};

describe("testing server class", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("testing initDatabase method", () => {
    it("should call db.authenticate", () => {
      const {
        server,
        db: { sequelize },
      } = setup();
      server.initDatabase();

      expect(sequelize.authenticate).toHaveBeenCalled();
    });
  });

  describe("testing loadControllers method", () => {
    it("should call app.use", () => {
      const { server, use, authController } = setup();
      const controllers = [authController];
      server.loadControllers(controllers);
      expect(use).toHaveBeenCalled();
    });

    it("should call app.use with controller path and setRoutes", () => {
      const { server, use, authController } = setup();
      const controllers = [authController];
      server.loadControllers(controllers);
      expect(use).toHaveBeenCalledWith(
        authController.path,
        authController.setRoutes()
      );
    });
  });

  describe("testing loadMiddleware method", () => {
    const mockMiddleware = () => jest.fn((req, res, next) => next());
    const middlewares = [mockMiddleware];

    it("should call app.use", () => {
      const { server, use } = setup();
      server.loadMiddleware(middlewares);
      expect(use).toHaveBeenCalled();
    });

    it("should call app.use with middleware", () => {
      const { use, server } = setup();
      server.loadMiddleware(middlewares);
      expect(use).toHaveBeenCalledWith(middlewares[0]);
    });
  });

  // describe("testing run method", () => {
  //   it("should call app.listen", () => {
  //     const { app, server } = setup();
  //     server.run();
  //     expect(app.listen).toHaveBeenCalled();
  //   });

  //   it("should call app.listen with port", () => {
  //     const { app, server } = setup();
  //     server.run();
  //     expect(app.listen).toHaveBeenCalledWith(8081, expect.anything());
  //   });
  // });
});
