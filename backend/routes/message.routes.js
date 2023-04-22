import express from "express";
import { protect } from "../middleawares/authMiddleaware.js";
import { sendMessage, allMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;
