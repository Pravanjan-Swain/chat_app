import {v2 as cloudinary} from "cloudinary";
import {config} from "dotenv";

config();       // 	Loads .env file variables into process.env.

cloudinary.config({         // Configures Cloudinary SDK using values from process.env.
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

export default cloudinary;

