import { NextFunction, Request, Response } from "express";
import { UserInt } from "../../typings";

const getMockRequest = (user?: Partial<UserInt>, token?: string) => {
  const { username, password, id } = user || {};
  const mockRequest = {
    headers: { authorization: `Bearer ${token || ""}` },
    body: { username, password, id },
  } as Request;
  return mockRequest;
};

const getMockResponse = () => {
  const json = jest.fn() as unknown as Response;
  const status = jest.fn().mockImplementation(() => ({ json }));
  const res = { status, json } as unknown as Response;
  return { res, json, status };
};

const getMockNext = () => {
  const next = jest.fn() as NextFunction;
  return next;
};

const getMockExpress = (user?: Partial<UserInt>, token?: string) => {
  const req = getMockRequest(user, token);
  const res = getMockResponse();
  const next = getMockNext();
  return { req, res, next };
};

export default getMockExpress;
