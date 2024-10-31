const express = require("express");
const socketIO = require("socket.io");
const http = require("node:http");
const path = require("path");
const { msgInfo, locInfo } = require("../utils/messages.js");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT | 3050;
const publicDir = path.join(__dirname, "../public/");

app.use(express.static(publicDir));

//let count = 0;
const userList = {};

io.on("connection", (socket) => {
  console.log("socket connected");

  //emit to every other client except self
  //socket.broadcast.emit("message", msgInfo("A new user has joined"));

  socket.on("roomJoin", ({ userName, roomName }) => {
    socket.userName = userName;
    socket.roomName = roomName;

    //creating a private room for a particular room name
    socket.join(roomName);
    if (!userList[`${socket.roomName}`]) {
      userList[`${socket.roomName}`] = [];
    }
    userList[`${socket.roomName}`].push({ userName: socket.userName });
    io.emit("joinUser", userList);
    //emit to the particular or active or self client
    socket.emit("systemMsg", `Welcome ${userName}!`);
    //emit to every other client in that room except self, ".to()" specifies a room in which the event will be listened
    socket.broadcast
      .to(roomName)
      .emit("systemMsg", `${socket.userName} has joined`);
  });

  socket.on("sendMsg", ({ value, userName, roomName }, callback) => {
    //emit to every client connected to the server
    socket.broadcast
      .to(roomName)
      .emit("message", msgInfo(value, socket.userName));
    socket.emit("myMessage", msgInfo(value, socket.userName));
    callback("Delivered");
  });

  socket.on("sendMsgSelf", () => {
    socket.emit(
      "message",
      msgInfo("Your Browser doesn't support sharing location"),
    );
  });

  socket.on("sendLocation", ({ loc, userName, roomName }, callback) => {
    socket.broadcast
      .to(roomName)
      .emit("messageLocation", locInfo(loc.lat, loc.long, socket.userName));
    socket.emit("systemMsg", "Your Location was sent");
    callback("Location Sent");
  });

  socket.on("disconnect", () => {
    if (userList[`${socket.roomName}`]) {
      userList[`${socket.roomName}`] = userList[`${socket.roomName}`].filter(
        (user) => {
          return user.userName !== socket.userName;
        },
      );
    }
    io.to(socket.roomName).emit(
      "systemMsg",
      `${socket.userName} has disconnected`,
    );
    io.emit("joinUser", userList);
  });

  //              COUNTER
  // socket.emit("countStatus", count);
  //
  // socket.on("updateCount", (id) => {
  //   count++;
  //
  //   io.emit("countStatus", count, id);
  // });
});

server.listen(port, () => console.log(`app is listening to port ${port}`));
