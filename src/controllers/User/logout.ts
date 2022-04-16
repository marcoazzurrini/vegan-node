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

const logout = async (req: Request, res: Response) => {
  const { token } = req.body;
  const query = `DELETE FROM refreshTokens WHERE username = '${token}'`;

  try {
    const connection = await Connect();
    await makeQuery(connection, query, res);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error,
    });
  }
};

export default logout;
