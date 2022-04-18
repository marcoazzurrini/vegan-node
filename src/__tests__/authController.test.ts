import AuthController from "../controllers/AuthController";
import { UserInt } from "../typings";
import getMockDatabase from "./testUtils/getMockDatabase";
import getMockExpress from "./testUtils/getMockExpress";
import getMockUserService, {
  UserServiceMethodsInt,
} from "./testUtils/getMockUserService";

const setup = (methodsResponse?: UserServiceMethodsInt, user?: UserInt) => {
  const db = getMockDatabase();
  const { MockUserService, methods } = getMockUserService(
    methodsResponse || {}
  );
  const authController = new AuthController(MockUserService, db);
  const {
    req,
    res: { res },
  } = getMockExpress(user);
  return {
    authController,
    req,
    res,
    methods,
    MockUserService,
    db,
  };
};

describe("testing authController", () => {
  describe("testing handleLogin", () => {
    it("should create userService instance", async () => {
      const { MockUserService, authController, req, res } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleLogin(req, res);

      expect(MockUserService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { MockUserService, authController, req, res, db } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleLogin(req, res);

      expect(MockUserService).toHaveBeenCalledWith("username", "password", db);
    });

    it("should call userService login method", async () => {
      const {
        authController,
        req,
        res,
        methods: { login },
      } = setup();
      await authController.handleLogin(req, res);

      expect(login).toHaveBeenCalled();
    });

    it("should sendError if userService login is not successful", async () => {
      const login = {
        message: "Invalid password",
        success: false,
      };
      const { authController, req, res } = setup({ login });
      await authController.handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService login is successful", async () => {
      const login = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, req, res } = setup({ login });
      await authController.handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const { authController, req, res } = setup();
      await authController.handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("testing handleRegister", () => {
    it("should create userService instance", async () => {
      const { MockUserService, authController, req, res } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleRegister(req, res);

      expect(MockUserService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { MockUserService, authController, req, res, db } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleRegister(req, res);

      expect(MockUserService).toHaveBeenCalledWith("username", "password", db);
    });

    it("should call userService register method", async () => {
      const {
        authController,
        req,
        res,
        methods: { register },
      } = setup();
      await authController.handleRegister(req, res);

      expect(register).toHaveBeenCalled();
    });

    it("should sendError if userService register is not successful", async () => {
      const register = {
        message: "Invalid password",
        success: false,
      };
      const { authController, req, res } = setup({ register });
      await authController.handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService register is successful", async () => {
      const register = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, req, res } = setup({ register });
      await authController.handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const { authController, req, res } = setup();
      await authController.handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("testing handleDeleteUser", () => {
    it("should create userService instance", async () => {
      const { MockUserService, authController, req, res } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleDeleteUser(req, res);

      expect(MockUserService).toHaveBeenCalled();
    });

    it("should instantiate userService with username and password", async () => {
      const { MockUserService, authController, req, res, db } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleDeleteUser(req, res);

      expect(MockUserService).toHaveBeenCalledWith("username", "password", db);
    });

    it("should call userService deleteUser method", async () => {
      const {
        authController,
        req,
        res,
        methods: { deleteUser },
      } = setup();
      await authController.handleDeleteUser(req, res);

      expect(deleteUser).toHaveBeenCalled();
    });

    it("should sendError if userService deleteUser is not successful", async () => {
      const deleteUser = {
        message: "Invalid password",
        success: false,
      };
      const { authController, req, res } = setup({ deleteUser });
      await authController.handleDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService deleteUser is successful", async () => {
      const deleteUser = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, req, res } = setup({ deleteUser });
      await authController.handleDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const { authController, req, res } = setup();
      await authController.handleDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("testing handleUpdatePassword", () => {
    it("should create userService instance", async () => {
      const { MockUserService, authController, req, res } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleUpdatePassword(req, res);

      expect(MockUserService).toHaveBeenCalled();
    });

    it("should instantiate UserService with username and password", async () => {
      const { MockUserService, authController, req, res, db } = setup(
        {},
        { username: "username", password: "password", id: "" }
      );
      await authController.handleUpdatePassword(req, res);

      expect(MockUserService).toHaveBeenCalledWith("username", "password", db);
    });

    it("should call userService updatePassword method", async () => {
      const {
        authController,
        req,
        res,
        methods: { updatePassword },
      } = setup();
      await authController.handleUpdatePassword(req, res);

      expect(updatePassword).toHaveBeenCalled();
    });

    it("should sendError if userService updatePassword is not successful", async () => {
      const updatePassword = {
        message: "Invalid password",
        success: false,
      };
      const { authController, req, res } = setup({ updatePassword });
      await authController.handleUpdatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should sendSuccess if userService updatePassword is successful", async () => {
      const updatePassword = {
        message: "Successfully logged in",
        success: true,
        data: {},
      };
      const { authController, req, res } = setup({ updatePassword });
      await authController.handleUpdatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should catch un-expected errors and call res with status code of 500", async () => {
      const { authController, req, res } = setup();
      await authController.handleUpdatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
