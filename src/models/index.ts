import databaseConfig from "../config/db.config";
import { Sequelize } from "sequelize";
import func from "./user";
const sequelize = new Sequelize(
  databaseConfig.DB,
  databaseConfig.USER,
  databaseConfig.PASSWORD,
  {
    host: databaseConfig.HOST,
    dialect: databaseConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      acquire: databaseConfig.pool.acquire,
      idle: databaseConfig.pool.idle,
    },
  }
);
const UserModel = func(sequelize);
const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = UserModel;

export default db;
