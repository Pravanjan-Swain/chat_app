import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message : "Unauthorized-No Token Provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message : "Unauthorized-Invalid Token Provided"})
        }

        const user = await User.findById(decoded.userId).select("-password") // Send everything except password

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        req.user = user;
        // Attaches the user object to req.user.
        //This makes the authenticated user's details available in the request object for the next middleware or route handler.
        // Other routes can now access the authenticated user by using req.user.

        next();
    }
    catch(err){
        console.log("Error in protectRoute middleware", err.message);
        res.status(500).json({message : "Internal server error"});
    }
}