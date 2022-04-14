import express from "express";
import cors from "cors";
import db from "./models";

const app = express();
const corsOptions = {
  origin: "http://localhost:8001",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.json({ message: "Hello!!!" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync DB");
});
