import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index";
import { DataInt } from "../typings/index";
import { UserModelInt } from "../models/UserModel";
import { ACCESS_TOKEN_SECRET } from "../config";

export interface AuthReturnData {
  message: string;
  success: boolean;
  data?: object;
}
const getUser = async (username: string) => {
  const userFromDb = await db.User.findOne({
    where: { username },
  });
  return userFromDb;
};

const appendUserToDB = async (username: string, password: string) => {
  const createdUser = await db.User.create({
    username,
    password,
  });
  return createdUser;
};

const createUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await appendUserToDB(username, hashedPassword);
  return createdUser;
};

const updateUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await db.User.update(
    { password: hashedPassword },
    { where: { username } }
  );
};

export default class UserService {
  constructor(
    public readonly username: string,
    public readonly password: string
  ) {}

  public async login(): Promise<AuthReturnData> {
    try {
      const userFromDb = await getUser(this.username);
      if (!userFromDb) return { message: "No such user", success: false };
      const isPasswordEqual = await bcrypt.compare(
        this.password,
        userFromDb.password
      );
      if (!isPasswordEqual) {
        return { message: "Invalid password", success: false };
      }
      const data = this.prepareData(userFromDb);
      return {
        message: "Successfully logged in",
        success: true,
        data: data,
      };
    } catch (error) {
      return { message: "An error occured", success: false };
    }
  }

  public async register(this: UserService): Promise<AuthReturnData> {
    try {
      const userFromDb = await getUser(this.username);
      if (userFromDb) return { message: "User already exists", success: false };

      const createdUser = await createUser(this.username, this.password);
      const data = this.prepareData(createdUser);
      return {
        message: "Successfully registered",
        success: true,
        data: data,
      };
    } catch (error) {
      return { message: "An error occured", success: false };
    }
  }

  public async deleteUser(): Promise<AuthReturnData> {
    try {
      const numberOfDeleteRows = await db.User.destroy({
        where: { username: this.username },
      });
      if (numberOfDeleteRows === 0)
        return { message: "User not found", success: false };

      return {
        message: "Successfully deleted user",
        success: true,
      };
    } catch (error) {
      return { message: "An error occured", success: false };
    }
  }

  public async updatePassword(): Promise<AuthReturnData> {
    try {
      const [numberOfUpdatedRows] = await updateUser(
        this.username,
        this.password
      );
      if (numberOfUpdatedRows === 0)
        return { message: "User not found", success: false };
      return {
        message: "Successfully updated password",
        success: true,
      };
    } catch (error) {
      return { message: "An error occured", success: false };
    }
  }

  private prepareData(user: UserModelInt): DataInt {
    const token = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    const data: DataInt = {
      user: {
        id: user.id,
        username: user.username,
        password: user.password,
      },
      jwt: token,
    };
    return data;
  }
}