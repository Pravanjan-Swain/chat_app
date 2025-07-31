import {Server} from "socket.io";
import http from "http";  //built-in in node
import express from "express";

const app = express();

const server = http.createServer(app);
// Creates an HTTP server that wraps the Express app.
// Required because Socket.IO needs a raw HTTP server to work with.
// Socket.IO does not directly attach to an Express app — it needs a raw HTTP server to integrate both HTTP (Express) and WebSocket (Socket.IO) protocols on the same port.

const io = new Server(server, {
    cors : {
        origin : ["http://localhost:5173"],  // write in form of array
    }
}); 

// used to store online users
const userSocketMap = {}; // {userId : socketId}

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//listen for any incoming connections
// socket is the user that is just connected
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("A user is disconnected", socket.id);
        delete userSocketMap[userId];   // delete the key value pair
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {io, app, server};