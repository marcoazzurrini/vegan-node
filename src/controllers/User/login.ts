import { Request, Response } from "express";
import { Connect, Query } from "../../config/mysql";
import { IMySQLResult, IUser } from "../../interfaces";
import bcryptjs from "bcryptjs";
import signJWT from "../../functions/signJTW";
import config from "../../config/config";
import { sign } from "jsonwebtoken";

const postRefreshToken = async (user: IUser, res: Response) => {
  try {
    const { username, password } = user;
    const connection = await Connect();
    const refreshToken = sign(
      { username, password },
      config.server.token.refreshTokenSecret
    );
    const query = `INSERT INTO refresh_tokens (tokenn) VALUES ("${refreshToken}")`;
    const res = await Query<IMySQLResult>(connection, query);
    console.log(res);
    return refreshToken;
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

const getSignJWTCallback = (userFromDB: IUser, res: Response) => {
  return async (_error: Error | null, token: string | null) => {
    if (_error) {
      return res
        .status(401)
        .json({ message: "Unable to Sign JWT", error: _error });
    }
    if (token) {
      const token = await postRefreshToken(userFromDB, res);

      return res.status(200).json({
        message: "Auth Successful",
        token,
        user: userFromDB,
      });
    }
  };
};

const getBcryptCallback = (userFromDB: IUser, res: Response) => {
  return (error: Error, result: boolean) => {
    if (error) throw new Error("Password Mismatch");
    if (result) {
      const signJWTCallback = getSignJWTCallback(userFromDB, res);
      signJWT(userFromDB, signJWTCallback);
    }
  };
};

const login = async (req: Request, res: Response) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const query = `SELECT * FROM Users WHERE username = '${username}'`;

  try {
    const connection = await Connect();
    const [user] = await Query<IUser[]>(connection, query);
    const bcryptCallback = getBcryptCallback(user, res);
    bcryptjs.compare(password, user.password, bcryptCallback);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

export default login;
