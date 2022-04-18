import { Sequelize } from "sequelize/types";
import { DatabaseInt } from "../../models";

const getMockSequelize = () => {
  const authenticate = jest.fn();
  const define = jest.fn();
  const sequelize = {
    authenticate,
    define,
  } as unknown as Sequelize;
  return { authenticate, define, sequelize };
};

export interface UserModelMethodsInt {
  findOne?: unknown;
  create?: unknown;
  destroy?: unknown;
  update?: unknown;
}

const getMockUserModel = (methodsResponse: UserModelMethodsInt) => {
  const findOne = jest.fn().mockImplementation(() => methodsResponse.findOne);
  const create = jest.fn().mockImplementation(() => methodsResponse.create);
  const destroy = jest.fn().mockImplementation(() => methodsResponse.destroy);
  const update = jest.fn().mockImplementation(() => methodsResponse.update);
  return { findOne, create, destroy, update };
};

const getMockDatabase = (methodsResponse?: UserModelMethodsInt) => {
  const sequelize = getMockSequelize();
  const User = getMockUserModel(methodsResponse || {});

  return { sequelize, User } as unknown as DatabaseInt;
};

export default getMockDatabase;
