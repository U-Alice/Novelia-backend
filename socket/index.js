
const io = require("socket.io")(8900, {cors: {
    origin: "http://localhost:3000"
}});
let users = [];

const addUser = (userId , socketId)=>{
    !users.some(user => user.userId ===  userId) && users.push ({userId , socketId})
}
const removeUser = (socketId)=>{
users =  users.filter(user => user.socketId !== socketId);
}
io.on("connection", (socket)=>{
    console.log("A user connected.");
    socket.on("addUser", (data)=>{
        addUser(data, socket.id)
        io.emit("getUsers", users)
    }) 
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
        removeUser(socket.id)
    })
})


