import { Router, urlencoded } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { deleteProfileImage, updateProfile, updateProfileImage } from "../controllers/userController.js";
import multer from "multer";

const userRoutes = Router();
const upload = multer({dest:"uploads/profiles/"})

userRoutes.post("/update-profile", verifyToken, updateProfile);
userRoutes.post("/add-profile-image", verifyToken,upload.single("profile-image"), updateProfileImage);
userRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage)

export default userRoutes