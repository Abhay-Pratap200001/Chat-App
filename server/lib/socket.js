import { Server } from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, 
  },
});


export function getReceverSocketId(userId){
  return userSocketMap[userId]
}

// used to store online user
const userSocketMap = {}

//connecting user
io.on("connection", (socket) => {
  console.log("A user connection", socket.id);

  const userId = socket.handshake.query.userId
  if (userId) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

//   if user disconnecting
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  });
});

export { io, app, server };
