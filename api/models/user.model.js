import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type:String,
        default:"https://cdn.vectorstock.com/i/500p/15/40/blank-profile-picture-image-holder-with-a-crown-vector-42411540.jpg",
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
