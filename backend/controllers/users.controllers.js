import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createSendToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const Signup = asyncHandler(async (req, res) => {
  const { Name: name, email, password, confirmPassword, image } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("Please Enter all the feids");
    }
    if (password !== confirmPassword) {
      throw new Error("Password not match!!");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    if (image) {
      var PhotoUrl = await cloudinary.uploader.upload(image.url);
    }
    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      pic: PhotoUrl?.url,
    });
    res.status(201).json({ user, token: createSendToken(user._id) });
  } catch (error) {
    throw new Error(error);
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body.values;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({ user, token: createSendToken(user._id) });
    } else {
      res.status(401);
      throw new Error("Invalid email or password!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const allUsers = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error.message);
  }
});
