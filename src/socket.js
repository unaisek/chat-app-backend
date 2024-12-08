import { Socket,Server as SocketIoServer } from "socket.io"
import Message from "./models/messageModel.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors : {
      origin: '*',
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket"]
  });
  
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    for (const [userId, sockeId] of userSocketMap.entries()){
      if(sockeId === socket.id) {
        userSocketMap.delete(userId);
        break
      }
    }
  }

  const sendMessage = async ( message ) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);
    const createMessage = await Message.create(message);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image colorTheme")
      .populate("recipient", "id email firstName lastName image colorTheme");

      if(recipientSocketId){
        io.to(recipientSocketId).emit("reciveMessage",messageData)
      }
       if (senderSocketId) {
         io.to(senderSocketId).emit("reciveMessage", messageData);
       }
  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId) {
      userSocketMap.set(userId, socket.id);
      
    } else {
      console.log("userId not provided");
    }
    socket.on("sendMessage", sendMessage)
    socket.on("disconnect",() => disconnect(socket))
  })
}

export default setupSocket