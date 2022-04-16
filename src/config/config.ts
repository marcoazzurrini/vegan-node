import dotenv from "dotenv";

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || "db4free.net";
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "vegan_node";
const MYSQL_USER = process.env.MYSQL_HOST || "dev_marco";
const MYSQL_PASS = process.env.MYSQL_HOST || "developer1234";

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 8080;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || "60s";
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "issue";
const SERVER_TOKEN_SECRET =
  process.env.SERVER_TOKEN_SECRET ||
  "da0a27ee45e685bd283508934ed6bd86ac313397f46f400665c608879302d17cd83ded174bd1cdc6a4a31499f9fcda6177895b53e13f3cd74934eef2a4441044";
const SERVER_REFRESH_TOKEN_SECRET =
  process.env.SERVER_REFRESH_TOKEN_SECRET ||
  "3d81acf60bbdc8c3d1c3864be3d19fa685773b1ca19e5a057a91842b20047b46881d01f0151388c75caf35a6d65142d71f72e58bd4311af966f4a8914880c0e9";
const MYSQL = {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  pass: MYSQL_PASS,
};

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
    refreshTokenSecret: SERVER_REFRESH_TOKEN_SECRET,
  },
};

const config = {
  mysql: MYSQL,
  server: SERVER,
};

export default config;
