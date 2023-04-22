import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  console.log("hi");
  const { chatId, content } = req.body;
  const { _id } = req.user;
  if (!chatId || !content) {
    return res.status(400).json({ message: "Invaliad data are passed" });
  }
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }
    const newMessage = new Message({
      sender: _id,
      content: content,
      chat: chatId,
    });

    let message = await Message.create(newMessage);

    message = await Message.populate(message, [
      { path: "sender", select: "name pic" },
      { path: "chat", populate: "users", select: "name pic email" },
    ]);

    await Chat.findByIdAndUpdate(chatId, {
      lastestMessage: message,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const allMessages = asyncHandler(async (req, res) => {
  console.log(req.params.chatId);
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic email"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
