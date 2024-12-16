import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel } from "../controllers/channelController.js";

const channelRoute = Router();
channelRoute.post("/create-channel", verifyToken, createChannel);

export default channelRoute;