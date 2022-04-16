import express from "express";
import {
  validateToken,
  register,
  login,
  logout,
  changePassword,
} from "../controllers/User";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get("/validate", extractJWT, validateToken);
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.put("/change_password", changePassword);

export default router;
