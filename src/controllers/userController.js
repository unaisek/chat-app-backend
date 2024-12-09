import mongoose from "mongoose";
import User from "../models/userModel.js";
import { renameSync, unlinkSync } from 'fs'
import Message from "../models/messageModel.js";
import { timeStamp } from "console";


export const updateProfile = async (req,res,next) => {
  try {
    
    const { userId } = req;     
    const { firstName, lastName, color } = req.body;
    
    if(!firstName || !lastName ){
      return res.status(400).send("firstName,lastName is required")
    }
    const user = await User.findByIdAndUpdate(userId,{ firstName, lastName, colorTheme:color, profileSetup:true },{new: true, runValidators: true});
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.colorTheme,
      },
    });

    
  } catch (error) {
     console.log({ error });
     return res.status(500).send("Internal server Error");
  }
}


export const updateProfileImage = async (req, res, next) => {
  try {
    const {userId} = req
    if(!req.file){
      return res.status(400).send("file is required")
    }   
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const user = await User.findByIdAndUpdate(userId,{image:fileName},{new:true, runValidators: true})
    return res.status(200).json({
      image: user.image
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};

export const deleteProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).send("User not found")
    }
    if(user.image){
      unlinkSync(user.image)
    }
    user.image =null;
    await user.save();

    return res.status(200).send("profile image deleted successfully")
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};


export const searchContacts = async (req, res, next) => {
  try {
    const {searchTerm } = req.body;
    if(searchTerm == undefined || searchTerm == null){
      return res.status(400).send("searchterm is required")
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\\]/g,
      "\\$&"
    )
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { 
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
        }
      ]
    });

    return res.status(200).json({contacts});
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};


export const getContactsForDMList = async (req, res, next) => {
  try {
    let {userId } = req;
    userId = new mongoose.Types.ObjectId(userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [ { sender: userId }, { recipient: userId } ]
        }
      },
      {
        $sort: { timeStamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender"
            }
          },
          lastMessageTime: { $first:"$timestamp" }
        }
      },
      {
        $lookup : {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo"
        }
      },
      {
        $unwind: "$contactInfo"
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          colorTheme: "$contactInfo.colorTheme",
        }
      }, 
      {
        $sort: { lastMessageTime: -1 }
      }
    ])
   

    return res.status(200).json({contacts});
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};
