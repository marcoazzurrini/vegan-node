import { sign, SignCallback, SignOptions } from "jsonwebtoken";
import config from "../config/config";
import IUser from "../interfaces/user";

type Callback = (error: Error | null, token: string | null) => void;
type SignJWT = (user: IUser, callback: Callback) => void;

const getJwtSignCallback = (callback: Callback): SignCallback => {
  return (error, token) => {
    if (error) {
      callback(error, null);
    }
    if (!error && token) {
      callback(null, token);
    }
  };
};

const getJwtSignOptions = (expirationTimeInSeconds: string): SignOptions => {
  return {
    issuer: config.server.token.issuer,
    algorithm: "HS256",
    expiresIn: expirationTimeInSeconds,
  };
};

const signJWT: SignJWT = (user, callback) => {
  try {
    sign(
      {
        username: user.username,
      },
      config.server.token.secret,
      getJwtSignOptions(config.server.token.expireTime),
      getJwtSignCallback(callback)
    );
  } catch (error) {
    callback(error instanceof Error ? error : null, null);
  }
};

export default signJWT;
