import { hash } from "bcryptjs";
import { UserModelInt } from "../models/UserModel";
import UserService from "../services/UserService";
import getMockDatabase, {
  UserModelMethodsInt,
} from "./testUtils/getMockDatabase";

const setup = (methods?: UserModelMethodsInt) => {
  const database = getMockDatabase(methods);
  const { sequelize, User } = database;
  const userService = new UserService("username", "password", database);
  return { User, sequelize, userService };
};

describe("testing userService", () => {
  describe("testing login method", () => {
    it("should call database", async () => {
      const {
        userService,
        User: { findOne },
      } = setup();
      await userService.login();
      expect(findOne).toHaveBeenCalled();
    });

    it("should return appropriate response if no user exists", async () => {
      const { userService } = setup();
      const res = await userService.login();
      expect(res).toEqual({ message: "No such user", success: false });
    });

    it("should return appropriate response if password doens't match", async () => {
      const { userService } = setup({ findOne: { password: "password_a" } });
      const res = await userService.login();
      expect(res).toEqual({ message: "Invalid password", success: false });
    });

    it("should return appropriate response if db query is successful", async () => {
      const password = await hash("password", 10);
      const user = {
        id: "id",
        username: "username",
        password,
      } as UserModelInt;

      const { userService } = setup({ findOne: user });
      const res = await userService.login();
      const resWithoutJwt = { ...res, data: { ...res.data, jwt: "jwt" } };

      expect(resWithoutJwt).toEqual({
        message: "Successfully logged in",
        success: true,
        data: { jwt: "jwt", user },
      });
    });

    it("should return appropriate response for un-expected error", async () => {
      const findOne = {
        methodName: "findOne",
        methodResponse: () => {
          throw new Error();
        },
      };
      const { userService } = setup({ findOne });
      const res = await userService.login();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });

  describe("testing register method", () => {
    it("should call findOne method", async () => {
      const {
        userService,
        User: { findOne },
      } = setup();
      await userService.register();
      expect(findOne).toHaveBeenCalled();
    });

    it("should call findOne method with username", async () => {
      const {
        userService,
        User: { findOne },
      } = setup();
      await userService.register();
      expect(findOne).toHaveBeenCalledWith({ where: { username: "username" } });
    });

    it("should return appropriate response if user already exists", async () => {
      const { userService } = setup({ findOne: "user" });
      const res = await userService.register();
      expect(res).toEqual({ message: "User already exists", success: false });
    });
    it("should call create method", async () => {
      const {
        userService,
        User: { create },
      } = setup();
      await userService.register();
      expect(create).toHaveBeenCalled();
    });

    it("should call create method with username and hashed password", async () => {
      const {
        userService,
        User: { create },
      } = setup();
      await userService.register();
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "username",
          password: expect.not.stringMatching("password"),
        })
      );
    });

    it("should return appropriate response if db query is successful", async () => {
      const password = await hash("password", 10);
      const user = {
        id: "id",
        username: "username",
        password,
      } as UserModelInt;

      const { userService } = setup({ create: user });
      const res = await userService.register();
      const resWithoutJwt = { ...res, data: { ...res.data, jwt: "jwt" } };

      expect(resWithoutJwt).toEqual({
        message: "Successfully registered",
        success: true,
        data: { jwt: "jwt", user },
      });
    });

    it("should return appropriate response for un-expected error", async () => {
      const { userService } = setup({ create: "weird response!" });
      const res = await userService.register();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });

  describe("testing deleteUser method", () => {
    it("should call destroy method", async () => {
      const {
        userService,
        User: { destroy },
      } = setup();
      await userService.deleteUser();
      expect(destroy).toHaveBeenCalled();
    });

    it("should call destroy method with username", async () => {
      const {
        userService,
        User: { destroy },
      } = setup();
      await userService.deleteUser();
      expect(destroy).toHaveBeenCalledWith({ where: { username: "username" } });
    });

    it("should return appropriate response if user doesn't exists", async () => {
      const { userService } = setup({ destroy: 0 });
      const res = await userService.deleteUser();
      expect(res).toEqual({ message: "User not found", success: false });
    });

    it("should return appropriate response if db query is successful", async () => {
      const { userService } = setup({ destroy: 1 });
      const res = await userService.deleteUser();

      expect(res).toEqual({
        message: "Successfully deleted user",
        success: true,
      });
    });

    it("should return appropriate response for un-expected error", async () => {
      const destroy = {
        methodName: "destroy",
        methodResponse: () => {
          throw new Error();
        },
      };
      const { userService } = setup({ destroy });
      const res = await userService.deleteUser();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });

  describe("testing updatePassword method", () => {
    it("should call update method", async () => {
      const {
        userService,
        User: { update },
      } = setup();
      await userService.updatePassword();
      expect(update).toHaveBeenCalled();
    });

    it("should call update method with username and hashed password", async () => {
      const {
        userService,
        User: { update },
      } = setup();
      await userService.updatePassword();

      expect(update).toHaveBeenCalledWith(
        { password: expect.anything() },
        { where: { username: "username" } }
      );
    });

    it("should return appropriate response if user doesn't exists", async () => {
      const { userService } = setup({ update: [0] });
      const res = await userService.updatePassword();
      expect(res).toEqual({ message: "User not found", success: false });
    });

    it("should return appropriate response if db query is successful", async () => {
      const { userService } = setup({ update: [1] });
      const res = await userService.updatePassword();

      expect(res).toEqual({
        message: "Successfully updated password",
        success: true,
      });
    });

    it("should return appropriate response for un-expected error", async () => {
      const update = {
        methodName: "update",
        methodResponse: () => {
          throw new Error();
        },
      };
      const { userService } = setup({ update });
      const res = await userService.updatePassword();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });
});
