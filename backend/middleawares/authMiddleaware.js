import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "JsonWenTokenError") {
        return res.status(401).json("Invalid token");
      } else if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json("Your session has expired,please login again");
      }
    }
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "The Token owner no longer exists." });
    }
    //check if the user has changed his password
    // if (currentUser.passwordChangedAfterTokenIssued(decoded.iat)) {
    //   return res.status(401).json({
    //     message: "Your password has been changed,please log in again",
    //   });
    // }
    req.user = currentUser;
    next();
  } catch (error) {
    throw new Error(error.message);
  }
});
