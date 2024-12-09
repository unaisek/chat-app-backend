import express from 'express';
import dotevn from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose, { get } from 'mongoose';
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoute.js';
import setupSocket from './socket.js';
import messageRoute from './routes/messagesRoute.js';

dotevn.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
  origin:[process.env.ORIGIN],
  methods:["GET","POST","PUT","PATCH","DELETE"],
  credentials:true,
}))
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoute);

const server = app.listen(port, ()=>{
  console.log(`server is running at http://localhost:${port}`);
})

setupSocket(server)

mongoose.connect(databaseURL).then(()=>{console.log("DB connected successfully");
"DB connection successfull"})
.catch((err) => console.log(err.message));