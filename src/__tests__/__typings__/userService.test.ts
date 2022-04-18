import { hash } from "bcryptjs";
import { DatabaseInt } from "../../models";
import { UserModelInt } from "../../models/UserModel";
import UserService from "../../services/UserService";

type Setup = (props?: { methodName: string; methodResponse?: unknown }) => {
  database: DatabaseInt;
  userService: UserService;
  method: jest.Mock;
};

const setup: Setup = (props = { methodName: "" }) => {
  const { methodName, methodResponse } = props;
  const method = jest.fn().mockImplementation(() => methodResponse);
  const database = {
    User: { [methodName]: method },
  } as unknown as DatabaseInt;
  const userService = new UserService("username", "password", database);
  return { database, userService, method };
};

describe("testing userService", () => {
  describe("testing login method", () => {
    it("should call database", async () => {
      const { userService, method: findOne } = setup({ methodName: "findOne" });
      await userService.login();
      expect(findOne).toHaveBeenCalled();
    });

    it("should return appropriate response if no user exists", async () => {
      const { userService } = setup({ methodName: "findOne" });
      const res = await userService.login();
      expect(res).toEqual({ message: "No such user", success: false });
    });

    it("should return appropriate response if password doens't match", async () => {
      const findOne = {
        methodName: "findOne",
        methodResponse: { password: "password_a" },
      };
      const { userService } = setup(findOne);
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
      const findOne = { methodName: "findOne", methodResponse: user };
      const { userService } = setup(findOne);
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
      const { userService } = setup(findOne);
      const res = await userService.login();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });

  describe("testing register method", () => {
    it("should call findOne method", async () => {
      const { userService, method: findOne } = setup({ methodName: "findOne" });
      await userService.login();
      expect(findOne).toHaveBeenCalled();
    });

    it("should call findOne method with username", async () => {
      const { userService, method: findOne } = setup({ methodName: "findOne" });
      await userService.login();
      expect(findOne).toHaveBeenCalledWith({ where: { username: "username" } });
    });

    it("should return appropriate response if user already exists", async () => {
      const { userService } = setup({ methodName: "findOne" });
      const res = await userService.login();
      expect(res).toEqual({ message: "User already exists", success: false });
    });
    it("should call create method", async () => {
      const { userService, method: create } = setup({ methodName: "create" });
      await userService.login();
      expect(create).toHaveBeenCalled();
    });

    it("should call create method with username and hashed password", async () => {
      const { userService, method: create } = setup({ methodName: "create" });
      await userService.login();
      const hashedPassword = await hash("password", 10);
      const createProps = { username: "username", password: hashedPassword };
      expect(create).toHaveBeenCalledWith(createProps);
    });

    it("should return appropriate response if db query is successful", async () => {
      const password = await hash("password", 10);
      const user = {
        id: "id",
        username: "username",
        password,
      } as UserModelInt;
      const create = { methodName: "create", methodResponse: user };
      const { userService } = setup(create);
      const res = await userService.login();
      const resWithoutJwt = { ...res, data: { ...res.data, jwt: "jwt" } };

      expect(resWithoutJwt).toEqual({
        message: "Successfully createed",
        success: true,
        data: { jwt: "jwt", user },
      });
    });

    it("should return appropriate response for un-expected error", async () => {
      const create = {
        methodName: "create",
        methodResponse: () => {
          throw new Error();
        },
      };
      const { userService } = setup(create);
      const res = await userService.login();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });

  describe("testing deleteUser method", () => {
    it("should call destroy method", async () => {
      const { userService, method: destroy } = setup({ methodName: "destroy" });
      await userService.login();
      expect(destroy).toHaveBeenCalled();
    });

    it("should call destroy method with username", async () => {
      const { userService, method: destroy } = setup({ methodName: "destroy" });
      await userService.login();
      expect(destroy).toHaveBeenCalledWith({ where: { username: "username" } });
    });

    it("should return appropriate response if user doesn't exists", async () => {
      const { userService } = setup({
        methodName: "destriy",
        methodResponse: 0,
      });
      const res = await userService.login();
      expect(res).toEqual({ message: "User not found", success: false });
    });

    it("should return appropriate response if db query is successful", async () => {
      const destroy = { methodName: "destroy", methodResponse: 1 };
      const { userService } = setup(destroy);
      const res = await userService.login();

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
      const { userService } = setup(destroy);
      const res = await userService.login();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });

  describe("testing updatePassword method", () => {
    it("should call update method", async () => {
      const { userService, method: update } = setup({ methodName: "update" });
      await userService.login();
      expect(update).toHaveBeenCalled();
    });

    it("should call update method with username and hashed password", async () => {
      const { userService, method: update } = setup({ methodName: "update" });
      await userService.login();
      const hashedPassword = await hash("password", 10);
      expect(update).toHaveBeenCalledWith(
        { password: hashedPassword },
        { where: { username: "username" } }
      );
    });

    it("should return appropriate response if user doesn't exists", async () => {
      const { userService } = setup({
        methodName: "destriy",
        methodResponse: 0,
      });
      const res = await userService.login();
      expect(res).toEqual({ message: "User not found", success: false });
    });

    it("should return appropriate response if db query is successful", async () => {
      const update = { methodName: "update", methodResponse: 1 };
      const { userService } = setup(update);
      const res = await userService.login();

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
      const { userService } = setup(update);
      const res = await userService.login();
      expect(res).toEqual({ message: "An error occurred", success: false });
    });
  });
});
