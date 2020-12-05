const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

http.listen(4000, () => console.log("server up and running on port 4000"));

var sockets = [];
io.on("connection", (socket) => {
  const id = socket.id;
  socket.on("username", (username) => {
    if (sockets.includes(username)) {
      socket.emit("username-used", true);
    } else {
      socket.emit("username-used", false);
      sockets.push({ id, username });
      // socket.username = username;
    }
  });
  socket.emit("joined-user", sockets);

  socket.on("send-message", (msg) => {
    if (!msg.user) return;
    // console.log(msg);
    socket.broadcast.emit("sent-message", msg);
    socket.emit("joined-user", sockets);
  });

  socket.on("disconnect", (data) => {
    console.log(
      "dis: ",
      sockets.find((e) => e.id === id)
    );
    // console.log("disconnect: " + sockets.find((e) => e.id === id));
    // sockets = sockets.filter((e) => e != socket.username);
  });
});
