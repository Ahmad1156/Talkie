import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chat.controller.js";
import { protect } from "../middleawares/authMiddleaware.js";
const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/removegroup").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

export default router;
