import { Request, Response } from "express";
import { Connect, Query } from "../../config/mysql";
import { IMySQLResult } from "../../interfaces";
import bcryptjs from "bcryptjs";

const getBcryptCallback = (username: string, res: Response) => {
  return async (hashError: Error | null, hash: string) => {
    if (hashError) throw hashError;
    const query = `INSERT INTO Users (username, password) VALUES ("${username}", "${hash}")`;
    const connection = await Connect();
    const result = await Query<IMySQLResult>(connection, query);
    return res.status(201).json(result);
  };
};

const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const bcryptCallback = getBcryptCallback(username, res);
    bcryptjs.hash(password, 10, bcryptCallback);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : null,
      error: error,
    });
  }
};

// const register = (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   bcryptjs.hash(password, 10, (hashError, hash) => {
//     if (hashError) {
//       return res.status(401).json({
//         message: hashError.message,
//         error: hashError,
//       });
//     }

//     const query = `INSERT INTO Users (username, password) VALUES ("${username}", "${hash}")`;
//     Connect()
//       .then((connection) => {
//         Query<IMySQLResult>(connection, query)
//           .then((result) => {
//             return res.status(201).json(result);
//           })
//           .catch((error) => {
//             return res.status(500).json({
//               message: error.message,
//               error,
//             });
//           });
//       })
//       .catch((error) => {
//         return res.status(500).json({
//           message: error.message,
//           error,
//         });
//       });
//   });
// };

export default register;
