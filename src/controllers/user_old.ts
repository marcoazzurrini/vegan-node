import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import signJWT from "../functions/signJTW";
import { Connect, Query } from "../config/mysql";
import { IUser, IMySQLResult } from "../interfaces";
import { sign } from "jsonwebtoken";
import config from "../config/config";

const makeConnection = async (res: Response) => {
  try {
    const connection = await Connect();
    return connection;
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

const makeQuery = async (connection: any, query: string, res: Response) => {
  try {
    const queryResult = await Query<IMySQLResult>(connection, query);
    return res.status(201).json(queryResult);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

const validateToken = (_: Request, res: Response) => {
  return res.status(200).json({
    message: "Token(s) validated",
  });
};

const register = (req: Request, res: Response) => {
  const { username, password } = req.body;

  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(401).json({
        message: hashError.message,
        error: hashError,
      });
    }

    const query = `INSERT INTO Users (username, password) VALUES ("${username}", "${hash}")`;

    Connect()
      .then((connection) => {
        Query<IMySQLResult>(connection, query)
          .then((result) => {
            return res.status(201).json(result);
          })
          .catch((error) => {
            return res.status(500).json({
              message: error.message,
              error,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  });
};

const postRefreshToken = async (
  username: string,
  password: string,
  res: Response
) => {
  const refreshToken = sign(
    { username, password },
    config.server.token.refreshTokenSecret
  );
  const query = `INSERT INTO refreshTokens (refreshToken) VALUES ("${refreshToken}")`;
  try {
    const connection = await Connect();
    await Query<IMySQLResult>(connection, query);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM Users WHERE username = '${username}'`;

  Connect()
    .then((connection) => {
      Query<IUser[]>(connection, query)
        .then((users) => {
          bcryptjs.compare(password, users[0].password, (error, result) => {
            if (error) {
              return res.status(401).json({
                message: "Password Mismatch",
              });
            } else if (result) {
              signJWT(users[0], (_error, token) => {
                if (_error) {
                  return res.status(401).json({
                    message: "Unable to Sign JWT",
                    error: _error,
                  });
                } else if (token) {
                  postRefreshToken(username, password, res);

                  return res.status(200).json({
                    message: "Auth Successful",
                    token,
                    user: users[0],
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            error,
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const logout = async (req: Request, res: Response) => {
  const { token } = req.body;
  const query = `DELETE FROM refreshTokens WHERE username = '${token}'`;

  try {
    const connection = await makeConnection(res);
    await makeQuery(connection, query, res);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const query = `UPDATE refreshTokens SET password = ${password} WHERE username = '${username}'`;

  try {
    const connection = await makeConnection(res);
    await makeQuery(connection, query, res);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

export default { validateToken, register, login, logout, changePassword };
