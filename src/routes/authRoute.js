import { Router } from "express";
import  { login, signUp, getUserData } from '../controllers/auth.controller.js'
import { verifyToken } from "../middlewares/authMiddleware.js";
const authRoutes = Router();

authRoutes.post("/signup",signUp);
authRoutes.post("/login",login)
authRoutes.get('/user-data',verifyToken,getUserData)

export default authRoutes
