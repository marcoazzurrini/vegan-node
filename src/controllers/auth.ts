import { Request, Response } from "express";

import db from "../models";
import secret from "../config/auth";
const User = db.user;
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = (req: Request, res: Response) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then(res.send({ message: "User was registered successfully!" }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

export const signin = (req: Request, res: Response) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
