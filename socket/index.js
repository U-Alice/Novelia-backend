const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log(users);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
console.log(users);
io.on("connection", (socket) => {
  console.log(socket.id, "connected");
  socket.on("addUser", (data) => {
    addUser(data, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = "62a5efb141d22784a0d27a72";

    console.log(senderId, text, receiverId);
    io.to("62a5f07341d22784a0d27a75").emit("getMessage", {
      senderId,
      text,
    });
  });
  //disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
  });
});
