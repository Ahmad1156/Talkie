import express from "express";
import userRouter from "./routes/users.route.js";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./database.js";
import { errorHandler, notFound } from "./middleawares/errorMiddleaware.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`app is listening on PORT ${PORT}`);
});
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

connectDB();

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined Room:" + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
