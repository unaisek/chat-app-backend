import { Socket,Server as SocketIoServer } from "socket.io"

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

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId) {
      userSocketMap.set(userId, socket.id);
      
    } else {
      console.log("userId not provided");
    }

    socket.on("disconnect",() => disconnect(socket))
  })
}

export default setupSocket