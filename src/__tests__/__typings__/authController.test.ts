import { Request, Response } from "express";
import AuthController from "../../controllers/AuthController";
import UserService, { AuthReturnData } from "../../services/UserService";

const getMockRequest = (username: string, password: string) => {
  const mockRequest = { body: { username, password } } as Request;
  return mockRequest;
};

const getMockResponse = () => {
  return {
    status: jest
      .fn()
      .mockImplementation(() => ({ json: jest.fn() } as unknown as Response)),
  } as unknown as Response;
};

const getUserServiceMethodMock = (response: AuthReturnData) => {
  return jest.fn().mockImplementation(() => response);
};

const getUserServiceMock = (methods: Record<string, jest.Mock>) => {
  return jest.fn().mockImplementation(() => {
    return { ...methods } as unknown as UserService;
  });
};

const setup = (
  methodName: string,
  methodResponse: AuthReturnData = { message: "success", success: true }
) => {
  const method = getUserServiceMethodMock(methodResponse);
  const userService = getUserServiceMock({ [methodName]: method });
  const authController = new AuthController(userService);
  const res = getMockResponse();
  return { userService, authController, res, method };
};

describe("testing authController", () => {
  describe("testing handleLogin", () => {
    it("should create userService instance", async () => {
      const { userService, authController, res } = setup("login");
      const req = getMockRequest("username", "password");
      await authController.handleLogin(req, res);

      expect(userService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { userService, authController, res } = setup("login");
      const req = getMockRequest("username", "password");
      await authController.handleLogin(req, res);

      expect(userService).toHaveBeenCalledWith("username", "password");
    });

    it("should call userService login method", async () => {
      const { authController, res, method: login } = setup("login");
      const req = getMockRequest("username", "password");
      await authController.handleLogin(req, res);

      expect(login).toHaveBeenCalled();
    });

    it("should sendError if userService login is not successful", async () => {
      const loginResponse = {
        message: "Invalid password",
        success: false,
      };
      const { authController, res } = setup("login", loginResponse);
      const req = getMockRequest("username", "password");
      await authController.handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService login is successful", async () => {
      const loginResponse = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, res } = setup("login", loginResponse);
      const req = getMockRequest("username", "password");
      await authController.handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const userService = getUserServiceMock({});
      const authController = new AuthController(userService);
      const res = getMockResponse();
      const req = getMockRequest("username", "password");
      await authController.handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("testing handleRegister", () => {
    it("should create userService instance", async () => {
      const { userService, authController, res } = setup("register");
      const req = getMockRequest("username", "password");
      await authController.handleRegister(req, res);

      expect(userService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { userService, authController, res } = setup("register");
      const req = getMockRequest("username", "password");
      await authController.handleRegister(req, res);

      expect(userService).toHaveBeenCalledWith("username", "password");
    });

    it("should call userService login method", async () => {
      const { authController, res, method: login } = setup("register");
      const req = getMockRequest("username", "password");
      await authController.handleRegister(req, res);

      expect(login).toHaveBeenCalled();
    });

    it("should sendError if userService login is not successful", async () => {
      const registerResponse = {
        message: "Invalid password",
        success: false,
      };
      const { authController, res } = setup("register", registerResponse);
      const req = getMockRequest("username", "password");
      await authController.handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService login is successful", async () => {
      const registerResponse = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, res } = setup("register", registerResponse);
      const req = getMockRequest("username", "password");
      await authController.handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const userService = getUserServiceMock({});
      const authController = new AuthController(userService);
      const res = getMockResponse();
      const req = getMockRequest("username", "password");
      await authController.handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("testing handleDeleteUser", () => {
    it("should create userService instance", async () => {
      const { userService, authController, res } = setup("deleteUser");
      const req = getMockRequest("username", "password");
      await authController.handleDeleteUser(req, res);

      expect(userService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { userService, authController, res } = setup("deleteUser");
      const req = getMockRequest("username", "password");
      await authController.handleDeleteUser(req, res);

      expect(userService).toHaveBeenCalledWith("username", "password");
    });

    it("should call userService deleteUser method", async () => {
      const { authController, res, method: deleteUser } = setup("deleteUser");
      const req = getMockRequest("username", "password");
      await authController.handleDeleteUser(req, res);

      expect(deleteUser).toHaveBeenCalled();
    });

    it("should sendError if userService deleteUser is not successful", async () => {
      const deleteUser = {
        message: "Invalid password",
        success: false,
      };
      const { authController, res } = setup("deleteUser", deleteUser);
      const req = getMockRequest("username", "password");
      await authController.handleDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService deleteUser is successful", async () => {
      const deleteUser = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, res } = setup("deleteUser", deleteUser);
      const req = getMockRequest("username", "password");
      await authController.handleDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const userService = getUserServiceMock({});
      const authController = new AuthController(userService);
      const res = getMockResponse();
      const req = getMockRequest("username", "password");
      await authController.handleDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("testing handleUpdatePassword", () => {
    it("should create userService instance", async () => {
      const { userService, authController, res } = setup("updatePassword");
      const req = getMockRequest("username", "password");
      await authController.handleUpdatePassword(req, res);

      expect(userService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { userService, authController, res } = setup("updatePassword");
      const req = getMockRequest("username", "password");
      await authController.handleUpdatePassword(req, res);

      expect(userService).toHaveBeenCalledWith("username", "password");
    });

    it("should call userService updatePassword method", async () => {
      const {
        authController,
        res,
        method: updatePassword,
      } = setup("updatePassword");
      const req = getMockRequest("username", "password");
      await authController.handleUpdatePassword(req, res);

      expect(updatePassword).toHaveBeenCalled();
    });

    it("should sendError if userService updatePassword is not successful", async () => {
      const updatePassword = {
        message: "Invalid password",
        success: false,
      };
      const { authController, res } = setup("updatePassword", updatePassword);
      const req = getMockRequest("username", "password");
      await authController.handleUpdatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService updatePassword is successful", async () => {
      const updatePassword = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, res } = setup("updatePassword", updatePassword);
      const req = getMockRequest("username", "password");
      await authController.handleUpdatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const userService = getUserServiceMock({});
      const authController = new AuthController(userService);
      const res = getMockResponse();
      const req = getMockRequest("username", "password");
      await authController.handleUpdatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
