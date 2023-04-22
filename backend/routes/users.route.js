import express from "express";
import { Signup, login,allUsers } from "../controllers/users.controllers.js";
import { protect } from "../middleawares/authMiddleaware.js";
const router = express.Router();

router.route("/").post(Signup).get(protect,allUsers);
router.route("/login").post(login);

export default router;
