import Controller, { Methods } from "../typings/Controller";
import { Request, Response } from "express";
import UserService from "../services/UserService";
import Token from "../services/TokenService";

export default class AuthController extends Controller {
  path = "/user";
  routes = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.handleLogin,
      localMiddlewares: [],
    },
    {
      path: "/register",
      method: Methods.POST,
      handler: this.handleRegister,
      localMiddlewares: [],
    },
    {
      path: "/delete",
      method: Methods.DELETE,
      handler: this.handleDeleteUser,
      localMiddlewares: [Token.verify],
    },
    {
      path: "/update_password",
      method: Methods.PUT,
      handler: this.handleUpdatePassword,
      localMiddlewares: [Token.verify],
    },
  ];

  constructor() {
    super();
  }

  async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const userService = new UserService(username, password);
      const data = await userService.login();
      if (!data.success) {
        super.sendError(res, data.message);
        return;
      }
      super.sendSuccess(res, data.data, data.message);
    } catch (e) {
      super.sendError(res);
    }
  }

  async handleRegister(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const userService = new UserService(username, password);
      const data = await userService.register();
      if (!data.success) {
        super.sendError(res, data.message);
        return;
      }
      super.sendSuccess(res, data.data, data.message);
    } catch (e) {
      super.sendError(res);
    }
  }

  async handleDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const userService = new UserService(username, password);
      const data = await userService.deleteUser();
      if (!data.success) {
        super.sendError(res, data.message);
        return;
      }
      super.sendSuccess(res, data.data, data.message);
    } catch (error) {
      super.sendError(res);
    }
  }

  async handleUpdatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const userService = new UserService(username, password);
      const data = await userService.updatePassword();
      if (!data.success) {
        super.sendError(res, data.message);
        return;
      }
      super.sendSuccess(res, data.data, data.message);
    } catch (error) {
      super.sendError(res);
    }
  }
}
