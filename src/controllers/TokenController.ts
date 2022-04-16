import { Request, Response } from "express";
import Controller, { Methods } from "../typings/Controller";
import Token from "../services/TokenService";

export default class TokenController extends Controller {
  path = "/";
  routes = [
    {
      path: "/token",
      method: Methods.POST,
      handler: this.getToken,
      localMiddlewares: [Token.verify],
    },
  ];

  getToken(req: Request, res: Response): void {
    const { verifiedUser } = req;
    if (verifiedUser) {
      const tokenVerificationData = { access: true, user: verifiedUser };
      super.sendSuccess(res, { tokenVerificationData });
    }
  }
}
