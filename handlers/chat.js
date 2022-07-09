const chat = () => {
  const http = require("http");
  const { Server } = require("socket.io");
  const server = http.createServer();
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      method: ["POST", "GET"],
    },
  });
  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`user with id = ${socket.id} joined room : ${data}`);
    });
    socket.on("send_message", (data) => {
      console.log(data);
      socket.to(data.room).emit("receive_message", data);
    });
  });
  server.listen(4002, () => {
    console.log("IO server running");
  });
};
module.exports.Chat = chat;
