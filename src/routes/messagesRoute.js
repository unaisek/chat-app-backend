import { Router } from "express"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages, uploadFile } from "../controllers/messageController.js";
import { upload } from "../middlewares/multer.js";

const messageRoute =Router();


messageRoute.post("/get-messages", verifyToken, getMessages);
messageRoute.post("/upload-file", verifyToken, upload.single("file"), uploadFile)


export default messageRoute