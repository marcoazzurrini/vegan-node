import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL || "databaseurl";
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_PORT = parseInt(process.env.DATABASE_PORT || "3306");
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME || "";
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";

export const PORT = parseInt(process.env.PORT || "8080");
export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "tokensecret";

const config = {
  database: {
    port: DATABASE_PORT,
    url: DATABASE_URL,
    name: DATABASE_NAME,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
  },
  server: {
    port: PORT,
    token: {
      access_secret: ACCESS_TOKEN_SECRET,
    },
  },
};

export default config;
