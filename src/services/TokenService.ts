import jwt, { VerifyCallback } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserInt } from "../typings/index";
import { ACCESS_TOKEN_SECRET } from "../config";

const handleJwtVerifyError = (res: Response) => {
  res.json({
    data: {
      tokenVerificationData: {
        access: false,
        message: "Failed to verify token",
      },
    },
  });
};

const makeJwtVerifyCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): VerifyCallback => {
  return (err, decodedFromToken) => {
    if (err) {
      handleJwtVerifyError(res);
      return;
    }

    const decoded = <{ user: object }>decodedFromToken;
    const decodedUser = <UserInt>decoded.user;
    if (decodedUser.id !== req.body.id) {
      handleJwtVerifyError(res);
      return;
    }
    req.verifiedUser = decodedUser;
    next();
  };
};

export default class Token {
  public static verify(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")?.[1];
    if (!token) {
      res.status(401).json({
        data: {
          tokenVerificationData: {
            access: false,
            message: "No token provided.",
          },
        },
      });
      return;
    }
    if (!req.body.id) {
      res.status(401).json({
        data: {
          tokenVerificationData: {
            access: false,
            message: "No user id provided.",
          },
        },
      });
      return;
    }
    const jwtVerifyCallback = makeJwtVerifyCallback(req, res, next);
    jwt.verify(token, ACCESS_TOKEN_SECRET, jwtVerifyCallback);
  }
}
