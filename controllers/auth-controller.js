import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Jimp from "jimp";

import User from "../models/user.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

import gravatar from "gravatar";

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signup = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,}
    })
}

const signin = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, {token});


    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,}
    })
}


const getCurrent = (req, res)=> {
    const {email, subscription} = req.user;

    res.json({
      email,
      subscription,
    })
}

const signout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

  res.status(204).json();
    // res.json(
    //     message: "Signout success"
    // )
}

// const updateAvatar = async (req, res) => {
//   const { _id } = req.user;

// const {path: oldPath, originalname} = req.file;

// const filename = `${_id}_${originalname}`;

//   const newPath = path.join(avatarPath, filename);
//     await fs.rename(oldPath, newPath);

//   // we make URL consider that all requests for files redirecting to folder public
//   const avatarURL = path.join("avatars", filename);
//   await User.findByIdAndUpdate(_id, { avatarURL });

//   res.json({ avatarURL });
// };

const updateAvatar = async (req, res) => {
    const { _id } = req.user;

    const { path: tempUpload, originalname } = req.file;  

    await Jimp.read(tempUpload)
        .then((avatar) => {
            return avatar
                .resize(250, 250) // resize
                .quality(60) // set JPEG quality
                .write(tempUpload); // save
        })
        .catch((err) => {
            throw err;
        });
    
    const filename = `${_id}_${originalname}`; 
    const resultUpload = path.join(avatarPath, filename); 
    await fs.rename(tempUpload, resultUpload); 
    const avatarURL = path.join('avatars', filename);  
    await User.findByIdAndUpdate(_id, { avatarURL }); 

    res.json({
        avatarURL,
    });
}


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
}