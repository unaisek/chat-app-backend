import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel, getUserChannel } from "../controllers/channelController.js";

const channelRoute = Router();
channelRoute.post("/create-channel", verifyToken, createChannel);
channelRoute.get("/get-user-channel", verifyToken, getUserChannel)

export default channelRoute;