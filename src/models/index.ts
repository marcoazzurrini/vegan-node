import { Sequelize } from "sequelize";
import { UserModelInt, UserModelStatic, getUser } from "./UserModel";
import config from "../config";

// ModelStatic provides a control logic for the model
// IModel provides an interface to model's instance

export interface DatabaseInt {
  sequelize: Sequelize;
  User: UserModelStatic;
}
const sequelize = new Sequelize(
  config.database.name || "vegan_node",
  config.database.username,
  config.database.password,
  {
    port: config.database.port,
    host: config.database.url,
    dialect: "mysql",
    pool: {
      max: 9,
      min: 0,
      idle: 10000,
    },
  }
);

// Models
const User = getUser(sequelize);

const db: DatabaseInt = {
  sequelize,
  User,
};

db.sequelize
  .sync()
  .then(() => console.log("Database & tables synced"))
  .catch((e) => console.log(e));

export default db;
export type UserModel = UserModelInt;
