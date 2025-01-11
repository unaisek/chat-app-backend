import { Router, urlencoded } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { deleteProfileImage, getAllContacts, getContactsForDMList, searchContacts, updateProfile, updateProfileImage } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
// import multer from "multer";

const userRoutes = Router();
// const upload = multer({dest:"uploads/profiles/"})

userRoutes.post("/update-profile", verifyToken, updateProfile);
userRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  updateProfileImage
);
userRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage);
userRoutes.post("/search",verifyToken, searchContacts);
userRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
userRoutes.get("/get-all-contacts",verifyToken,getAllContacts)

export default userRoutes