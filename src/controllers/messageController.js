import Message from "../models/messageModel.js";
import { mkdirSync, renameSync } from 'fs'
import cloudinary from "../utils/cloudinary.js";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2  = req.body.id
    if (!user1 || !user2) {
      return res.status(400).send("both user id are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2},
        { sender: user2, recipient: user1 },
      ],
    }).sort({timestap: 1});

    return res.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};



export const uploadFile = async (req, res, next) => {
  try {
    if(!req.file){
      return res.status(400).send("file is required");
    }
    // const date = Date.now();
    // let fileDir = `uploads/files/${date}`;
    // let fileName = `${fileDir}/${req.file.originalname}`;

    // mkdirSync(fileDir,{recursive: true});

    // renameSync(req.file.path, fileName);
    const uploadToCloudinary = (fileBuffer) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "files" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
    const result = await uploadToCloudinary(req.file.buffer);


    return res.status(200).json({ filePath:result.secure_url });
    
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};
