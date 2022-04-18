const { DataTypes } = require("sequelize"); // eslint-disable-line
import { getUser } from "../models/UserModel";
import getMockDatabase from "./testUtils/getMockDatabase";

const setup = () => {
  const { sequelize } = getMockDatabase();
  return { define: sequelize.define, sequelize };
};

describe("testing userModel", () => {
  it("getUser should call sequelize.define", () => {
    const { define, sequelize } = setup();
    getUser(sequelize);
    expect(define).toHaveBeenCalled();
  });

  it("should call sequelize.define with appropriate parameters", () => {
    const { define, sequelize } = setup();
    getUser(sequelize);
    expect(define).toHaveBeenCalledWith(
      "user",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
      }
    );
  });
});
