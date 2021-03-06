const express = require('express')
const cors = require("cors")
const server = express()
server.use(cors())

const PORT = process.env.PORT || 3000;

server.use((req, res) => res.send("Yeah... Aluta socket server is running"))
  
  
const io = require("socket.io")(8900, {
    cors:{
        origin:"https://aluta.vercel.app"
    }
})

let users = []
// add user to socket connection
const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && 
    users.push({userId, socketId});
}


io.on("connection", socket => {
    
    console.log("a user connected")
    
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
        console.log(users)
        
    })
    // remove user from socket connection
    const removeUser = socketId => {
        users = users?.filter(user => user.socketId !== socketId)
        console.log(users)
    }
    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id)
        io.emit("getUsers", users)
    })

    const getUser = userId => users.find(user => user.userId === userId)
    
    // send and get message
    socket.on("sendMessage", ({senderId, recieverId, text, _id}) => {
        const user = getUser(recieverId);
        console.log(senderId, text, recieverId)
        user && io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
            recieverId,
            _id
        })
    }) 
})

server.listen(PORT, () => console.log(`running on ${PORT}`))
