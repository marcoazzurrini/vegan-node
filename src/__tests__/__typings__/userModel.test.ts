import { Sequelize } from "sequelize";
const { DataTypes } = require("sequelize"); // eslint-disable-line
import { getUser } from "../../models/UserModel";

const setup = () => {
  const mockDefine = jest.fn();
  const sequelize = {
    define: mockDefine,
  } as unknown as Sequelize;
  return { mockDefine, sequelize };
};

describe("testing userModel", () => {
  it("getUser should call sequelize.define", () => {
    const { mockDefine, sequelize } = setup();
    getUser(sequelize);
    expect(mockDefine).toHaveBeenCalled();
  });

  it("should call sequelize.define with appropriate parameters", () => {
    const { mockDefine, sequelize } = setup();
    getUser(sequelize);
    expect(mockDefine).toHaveBeenCalledWith(
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
