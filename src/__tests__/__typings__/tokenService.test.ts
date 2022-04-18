import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config";
import Token from "../../services/TokenService";
import { UserInt } from "../../typings";

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

type Setup = (props?: {
  token?: string;
  reqBody?: Record<string, unknown>;
}) => {
  handlerProps: [Request, Response, NextFunction];
  mockJson: jest.Mock;
};

const setup: Setup = ({ token, reqBody } = { reqBody: {} }) => {
  const mockJson = jest.fn();
  const req = {
    headers: { authorization: `Bearer ${token || ""}` },
    body: { ...reqBody },
  };
  const res = {
    json: mockJson,
  };
  const next = jest.fn();
  const handlerProps = [req, res, next] as unknown as [
    Request,
    Response,
    NextFunction
  ];
  return { handlerProps, mockJson };
};

describe("testing token controller", () => {
  describe("testing verify static method", () => {
    it("should call json method on res ", () => {
      const { handlerProps, mockJson } = setup();
      Token.verify(...handlerProps);

      expect(mockJson).toHaveBeenCalled();
    });

    it("should call json with appropriate parameters if no token is provided", () => {
      const { handlerProps, mockJson } = setup();
      Token.verify(...handlerProps);
      const noTokenProvidedError = getTokenVerificationReponse(
        false,
        "No token provided."
      );

      expect(mockJson).toHaveBeenCalledWith(noTokenProvidedError);
    });

    it("should call json with appropriate parameters if no token is provided", () => {
      const { handlerProps, mockJson } = setup({ token: "jwtToken" });
      Token.verify(...handlerProps);
      const noUserIdProvidedError = getTokenVerificationReponse(
        false,
        "No user id provided."
      );
      expect(mockJson).toHaveBeenCalledWith(noUserIdProvidedError);
    });

    it("should call json with appropriate parameters if token verification fails", () => {
      const { handlerProps, mockJson } = setup({
        token: "jwtToken",
        reqBody: { id: "id" },
      });
      Token.verify(...handlerProps);
      const tokenVerificationError = getTokenVerificationReponse(
        false,
        "Failed to verify token"
      );

      expect(mockJson).toHaveBeenCalledWith(tokenVerificationError);
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
      const { handlerProps, mockJson } = setup({
        token: token,
        reqBody: { ...user },
      });
      Token.verify(...handlerProps);

      expect(mockJson).not.toHaveBeenCalled();
    });

    it("should call json if token is verified but userId not matching", () => {
      const user: UserInt = {
        id: "id",
        username: "username",
        password: "password",
      };
      const token = jwt.sign(
        { user: { ...user, id: "id1" } },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );
      const { handlerProps, mockJson } = setup({
        token: token,
        reqBody: { ...user },
      });
      Token.verify(...handlerProps);

      expect(mockJson).toHaveBeenCalled();
    });
  });
});
