import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password) res.status(400).json({message : "Invalid user data"});

    try{
        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,email,password:hashedPassword
        })

        if(newUser){
            let token = generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser.id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic
            })
        }
        else{
            res.status(400).json({message : "Invalid user data"});
        }
    }
    catch(err){
        console.log("Error in signup controller", err.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password) return res.status(400).json({message : "Invalid credentials"});
    
    try{
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credentials"});
        }

        let token = generateToken(user._id,res);

        res.status(200).json({
            _id : user.id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic
        })
    }
    catch(err){
        console.log("Error in the login controller", err.message);
        res.status(500).json({message : "Internal Server Error"});
    }
};

export const logout = (req,res) => {
    try{
        res.clearCookie("jwt", {
            httpOnly : true,   // prevent XSS attacks cross-site sccripting attacks
            sameSite : "strict", // CSRF attacks cross-site request forgery attacks
            secure : process.env.NODE_ENV !== "development"
        });
        // res.cookie("jwt", "", {maxAge : 0});    //  Replaces the JWT with an empty string (""). Expires the cookie immediately (maxAge: 0), making the browser remove it on the **next response.**
        res.status(200).json({message : "Logged out successfully"});
    }
    catch(err){
        console.log("Error in the logout controller", err.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const updateProfile = async (req,res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message : "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic : uploadResponse.secure_url}, {new:true});  // UpdatedUser is an object

        return res.status(200).json(updatedUser);
    }   
    catch(err){
        console.log("error in updated profile:",err);
        return res.status(500).json({message : "Internal server error"});
    }
}

export const checkAuth = async (req,res) => {
    try{
        return res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in the checkAuth controller", err.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}





































// Example of the response by cloudinary

// {
//     "asset_id": "abc123xyz456",
//     "public_id": "my-folder/profile-pic-xyz",
//     "version": 1700000000,
//     "version_id": "1234abcd5678efgh",
//     "signature": "abcdefgh12345678ijklmnopqrst",
//     "width": 500,
//     "height": 500,
//     "format": "jpg",
//     "resource_type": "image",
//     "created_at": "2024-03-23T12:30:00Z",
//     "tags": [],
//     "bytes": 102400,
//     "type": "upload",
//     "etag": "123456789abcdef",
//     "placeholder": false,
//     "url": "http://res.cloudinary.com/my-cloud/image/upload/v1700000000/sample.jpg",
//     "secure_url": "https://res.cloudinary.com/my-cloud/image/upload/v1700000000/sample.jpg",
//     "original_filename": "profile-pic"
// }