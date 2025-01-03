import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel, getChannelMessages, getUserChannel } from "../controllers/channelController.js";

const channelRoute = Router();
channelRoute.post("/create-channel", verifyToken, createChannel);
channelRoute.get("/get-user-channel", verifyToken, getUserChannel);
channelRoute.get("/channel-messages/:channelId",verifyToken, getChannelMessages)

export default channelRoute;