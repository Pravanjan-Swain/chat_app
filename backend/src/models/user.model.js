import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },
    fullName : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    profilePic : {
        type : String,
        default : "",
    }    
},{timestamps : true}
)

// In Mongoose, setting { timestamps: true } in a schema automatically adds two fields to your documents:
// createdAt – Stores the date and time when the document was first created.
// updatedAt – Stores the date and time when the document was last updated.
// createdAt and updatedAt will be automatically updated.

const User = mongoose.model("User",userSchema);

export default User;