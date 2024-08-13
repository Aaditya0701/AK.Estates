import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    userName:{
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;
