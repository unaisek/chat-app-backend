import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { genSalt, hash } = bcrypt

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  colorTheme: {
    type: Number,
    required: false
  },
  profileSetup: {
    type: Boolean,
    default: false,
  }
});

userSchema.pre("save", async function(next){
  const salt = await genSalt();
  this.password = await hash(this.password,salt);
  next()
})

const User = mongoose.model("Users",userSchema);

export default User