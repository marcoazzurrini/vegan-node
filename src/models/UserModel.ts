import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export interface UserModelInt extends Model {
  readonly id: string;
  readonly username: string;
  readonly password: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModelInt;
};

export function getUser(sequelize: Sequelize): UserModelStatic {
  return <UserModelStatic>sequelize.define(
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
}
