import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "user not authorized." });
  }

  const isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("lastestMessage");
  const senderChat = await User.populate(isChat, {
    path: "lastestMessage.sender",
    select: "name pic email",
  });
  if (senderChat.length > 0) {
    res.json(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "lastestMessage.sender",
          select: "name pic email",
        });
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChat = asyncHandler(async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "please fill all fields" });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res
        .status(400)
        .json("More than 2 usersare required to form a group chat");
    }
    users.push(req.user._id);
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user._id,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.name);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(updatedChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      return res.status(404).json({ message: "Chat is not Found anymore!" });
    }
    res.json(added);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      return res.status(404).json({ message: "Chat is not Found anymore!" });
    }
    res.json(removed);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
