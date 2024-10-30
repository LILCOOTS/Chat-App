const express = require("express");
const socketIO = require("socket.io");
const http = require("node:http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT | 3050;
const publicDir = path.join(__dirname, "../public/");

app.use(express.static(publicDir));

//let count = 0;

io.on("connection", (socket) => {
  console.log("socket connected");

  //emit to the particular or active or self client
  socket.emit("message", "Welcome!");
  //emit to every other client except self
  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMsg", (val, callback) => {
    //emit to every client connected to the server
    io.emit("message", val);
    callback("Delivered");
  });

  socket.on("sendMsgSelf", () => {
    socket.emit("message", "Your Browser doesn't support sharing location");
  });

  socket.on("sendLocation", (loc, callback) => {
    socket.broadcast.emit(
      "message",
      `https://google.com/maps?q=${loc.lat},${loc.long}`,
    );
    callback("Location Sent");
  });

  socket.on("disconnect", () => {
    io.emit("message", "Someone disconnected");
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
