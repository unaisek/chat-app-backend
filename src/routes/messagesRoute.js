import { Router } from "express"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages } from "../controllers/messageController.js";

const messageRoute =Router()

messageRoute.post("/get-messages", verifyToken, getMessages);


export default messageRoute