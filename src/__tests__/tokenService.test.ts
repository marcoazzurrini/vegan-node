import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import Token from "../services/TokenService";
import { UserInt } from "../typings";
import getMockExpress from "./testUtils/getMockExpress";

const getTokenVerificationReponse = (access: boolean, message: string) => {
  return {
    data: {
      tokenVerificationData: {
        access,
        message,
      },
    },
  };
};

const setup = (props?: { token?: string; user?: Partial<UserInt> }) => {
  const { user, token } = props || {};
  const {
    req,
    res: { res, json },
    next,
  } = getMockExpress(user, token);
  return { req, res, json, next };
};

describe("testing token controller", () => {
  describe("testing verify static method", () => {
    it("should call json method on res ", () => {
      const { req, res, json, next } = setup();
      Token.verify(req, res, next);

      expect(json).toHaveBeenCalled();
    });

    it("should call json with appropriate parameters if no token is provided", () => {
      const { req, res, next, json } = setup();
      Token.verify(req, res, next);
      const noTokenProvidedError = getTokenVerificationReponse(
        false,
        "No token provided."
      );

      expect(json).toHaveBeenCalledWith(noTokenProvidedError);
    });

    it("should call json with appropriate parameters if no token is provided", () => {
      const { req, res, next, json } = setup({ token: "jwtToken" });
      Token.verify(req, res, next);
      const noUserIdProvidedError = getTokenVerificationReponse(
        false,
        "No user id provided."
      );
      expect(json).toHaveBeenCalledWith(noUserIdProvidedError);
    });

    it("should call json with appropriate parameters if token verification fails", () => {
      const { req, res, next, json } = setup({
        token: "jwtToken",
        user: { id: "id" },
      });
      Token.verify(req, res, next);
      const tokenVerificationError = getTokenVerificationReponse(
        false,
        "Failed to verify token"
      );

      expect(json).toHaveBeenCalledWith(tokenVerificationError);
    });

    it("should not call json if verification is successful", () => {
      const user: UserInt = {
        id: "id",
        username: "username",
        password: "password",
      };
      const token = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      const { req, res, next, json } = setup({
        token: token,
        user,
      });
      Token.verify(req, res, next);

      expect(json).not.toHaveBeenCalled();
    });

    it("should call json if token is verified but userId not matching", () => {
      const user: UserInt = {
        id: "id",
        username: "username",
        password: "password",
      };
      const token = jwt.sign(
        { user: { user, id: "id1" } },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );
      const { req, res, next, json } = setup({
        token: token,
        user,
      });
      Token.verify(req, res, next);

      expect(json).toHaveBeenCalled();
    });
  });
});
