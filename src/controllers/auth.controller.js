import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const maxAge = 3 * 60 * 60 * 1000;

const createToken = (email, userId) =>{
  return jwt.sign({ email, userId }, process.env.JWT_SECRET_kEY,{expiresIn:maxAge});
}



export const signUp = async (req, res,next) =>{
  try {
    console.log("api call reached");
    
    const { email, password} = req.body;
    if(!email || !password) {
      return res.status(400).send("Email and password is required")
    }
    const user = await User.create({email, password});
    res.cookie("jwt",createToken(email,user.id), {
      maxAge,
      secure: true,
      sameSite: "None"

    }) 
    return res.status(201).json({
      user: {
        id:user.id,
        email:user.email,
        profileSetup: user.profileSetup
      }
    })
  } catch (error) {
    console.log({error});
    return res.status(500).send("Internal server Error")
  } 
}


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is required");
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).send("User not found! please enter valid user")
    }
    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
      return res.status(400).send("Password is incorrect.");
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.colorTheme
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};

export const getUserData  = async (req,res,next) => {
  try { 
    const user = await User.findById(req.userId)
    if(!user){
      return res.status(404).send("user not found")
    }
    
    return res.status(200).json({
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.colorTheme
   
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
}


export const logOut = async (req, res, next) => {
  try {
    
    res.cookie("jwt", "", {
      maxAge: 1,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).send("logout succesfull");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server Error");
  }
};
