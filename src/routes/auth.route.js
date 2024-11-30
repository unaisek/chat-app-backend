import { Router } from "express";
import  { login, signUp } from '../controllers/auth.controller.js'
const authRoutes = Router();

authRoutes.post("/signup",signUp);
authRoutes.post("/login",login)

export default authRoutes
