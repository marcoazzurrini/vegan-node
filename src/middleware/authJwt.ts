import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secret from "../config/auth";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  if (!token || Array.isArray(token)) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};
export default authJwt;
