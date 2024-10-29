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

let count = 0;

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.emit("countStatus", count);

  socket.on("updateCount", (id) => {
    count++;

    io.emit("countStatus", count, id);
  });
});

server.listen(port, () => console.log(`app is listening to port ${port}`));
