import { DataTypes, Sequelize } from "sequelize/types";

const func = (sequelize: Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  });
  return User;
};
export default func;
