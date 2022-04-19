import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DatabaseInt } from "../models/index";
import { DataInt } from "../typings/index";
import { UserModelInt } from "../models/UserModel";
import { ACCESS_TOKEN_SECRET } from "../config";

export interface AuthReturnData {
  message: string;
  success: boolean;
  data?: object;
}
const getUser = async (username: string, db: DatabaseInt) => {
  const userFromDb = await db.User.findOne({
    where: { username },
  });

  return userFromDb;
};

const appendUserToDB = async (
  username: string,
  password: string,
  db: DatabaseInt
) => {
  const createdUser = await db.User.create({
    username,
    password,
  });

  return createdUser;
};

const createUser = async (
  username: string,
  password: string,
  db: DatabaseInt
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await appendUserToDB(username, hashedPassword, db);
  return createdUser;
};

const updateUser = async (
  username: string,
  password: string,
  db: DatabaseInt
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await db.User.update(
    { password: hashedPassword },
    { where: { username } }
  );
};

export default class UserService {
  constructor(
    public readonly username: string,
    public readonly password: string,
    private readonly database: DatabaseInt
  ) {}

  public async login(): Promise<AuthReturnData> {
    try {
      const userFromDb = await getUser(this.username, this.database);

      if (!userFromDb) return { message: "No such user", success: false };

      const isPasswordEqual = await bcrypt.compare(
        this.password,
        userFromDb.password
      );

      if (!isPasswordEqual) {
        return { message: "Invalid password", success: false };
      }
      if (userFromDb && !userFromDb.id) {
        throw new Error();
      }
      const data = this.prepareData(userFromDb);
      return {
        message: "Successfully logged in",
        success: true,
        data: data,
      };
    } catch (error) {
      return { message: "An error occurred", success: false };
    }
  }

  public async register(): Promise<AuthReturnData> {
    try {
      const userFromDb = await getUser(this.username, this.database);
      if (userFromDb) return { message: "User already exists", success: false };

      const createdUser = await createUser(
        this.username,
        this.password,
        this.database
      );

      if (createdUser && !createdUser.id) {
        throw new Error();
      }
      const data = this.prepareData(createdUser);
      return {
        message: "Successfully registered",
        success: true,
        data: data,
      };
    } catch (error) {
      return { message: "An error occurred", success: false };
    }
  }

  public async deleteUser(): Promise<AuthReturnData> {
    try {
      const numberOfDeleteRows = await this.database.User.destroy({
        where: { username: this.username },
      });
      if (numberOfDeleteRows === 0)
        return { message: "User not found", success: false };
      if (typeof numberOfDeleteRows !== "number") {
        throw new Error();
      }
      return {
        message: "Successfully deleted user",
        success: true,
      };
    } catch (error) {
      return { message: "An error occurred", success: false };
    }
  }

  public async updatePassword(): Promise<AuthReturnData> {
    try {
      const [numberOfUpdatedRows] = await updateUser(
        this.username,
        this.password,
        this.database
      );

      if (numberOfUpdatedRows === 0)
        return { message: "User not found", success: false };
      if (typeof numberOfUpdatedRows !== "number") {
        throw new Error();
      }
      return {
        message: "Successfully updated password",
        success: true,
      };
    } catch (error) {
      return { message: "An error occurred", success: false };
    }
  }

  private prepareData(user: UserModelInt): DataInt {
    const safeUser = { id: user.id, username: user.username };
    const token = jwt.sign({ user: safeUser }, ACCESS_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    const data: DataInt = {
      user: safeUser,
      jwt: token,
    };
    return data;
  }
}
