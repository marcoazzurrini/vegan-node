import { Request, Response } from "express";
import { Connection } from "mysql";
import { Connect, Query } from "../../config/mysql";
import { IMySQLResult } from "../../interfaces";

const makeQuery = async (
  connection: Connection,
  query: string,
  res: Response
) => {
  try {
    await Query<IMySQLResult>(connection, query);
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error : null,
      error,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const query = `UPDATE refreshTokens SET password = ${password} WHERE username = '${username}'`;

  try {
    const connection = await Connect();
    await makeQuery(connection, query, res);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error : null,
      error,
    });
  }
};

export default changePassword;
