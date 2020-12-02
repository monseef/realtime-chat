const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

http.listen(4000, () => console.log("server up and running on port 4000"));

var sockets = [];
io.on("connection", (socket) => {
  const id = socket.id;
  console.log("we got connected");

  socket.on("username", (username) => {
    for (let item in sockets) {
      if (sockets[item] === username) return;
    }
    sockets[id] = username;
    console.log(sockets);
    socket.broadcast.emit("joined-user", username);
  });

  socket.on("disconnect", (data) => {
    socket.broadcast.emit("user-disconnect", sockets[id]);
    console.log("we got disconnected");
  });
});
