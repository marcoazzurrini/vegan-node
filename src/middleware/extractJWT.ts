import jwt from "jsonwebtoken";
import config from "../config/config";
import { Request, Response, NextFunction } from "express";

type ExtractJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | undefined>;

const verifyToken = (token: string, res: Response, next: NextFunction) => {
  const tokenSecret = config.server.token.secret;

  jwt.verify(token, tokenSecret, (error, decoded) => {
    if (error) {
      return res.status(404).json({
        message: error,
        error,
      });
    }
    res.locals.jwt = decoded;
    next();
  });
};

export const extractJWT: ExtractJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  verifyToken(token, res, next);
};

export default extractJWT;
