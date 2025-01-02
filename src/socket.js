import { Socket,Server as SocketIoServer } from "socket.io"
import Message from "./models/messageModel.js";
import Channel from "./models/channelModel.js";

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

  const sendChannelMessage = async (message) => {   
    const { channelId,sender, content, messageType, fileUrl } = message;
    
    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl

    })
    
    const messageData = await Message.findById(createMessage._id).populate(
      "sender",
      "id email firstName lastName image colorTheme"
    ).exec();   

    await Channel.findByIdAndUpdate(channelId, { $push: { messages: createMessage._id } });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id};

    if(channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if(memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message",finalData)
        }
      })
       const adminSocketId = userSocketMap.get(channel.admin._id.toString());
       if (adminSocketId) {
         io.to(adminSocketId).emit("recieve-channel-message", finalData);
       }
    }

  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId) {
      userSocketMap.set(userId, socket.id);
      
    } else {
      console.log("userId not provided");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect",() => disconnect(socket))
  })
}

export default setupSocket