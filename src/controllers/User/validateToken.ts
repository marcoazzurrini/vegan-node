import { Request, Response } from "express";

const validateToken = (_: Request, res: Response) => {
  return res.status(200).json({
    message: "Token(s) validated",
  });
};

export default validateToken;
