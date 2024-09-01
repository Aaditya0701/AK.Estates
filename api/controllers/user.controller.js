import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({
        message: 'hello Aadi',
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You are not Authenticated'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You are not Authenticated'));
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')    // 👈🏻👈🏻👈🏻 clear cookie after deleting user
        res.status(200).json('User has been Deleted.')
    } catch (error) {
        next(error)
    }
}

export const checkUnique = async (req, res) => {
    const { userName, email, userId } = req.body;

    try {
        // Check if another user has the same username or email
        const userWithSameUserName = await User.findOne({ userName, _id: { $ne: userId } });
        const userWithSameEmail = await User.findOne({ email, _id: { $ne: userId } });

        if (userWithSameUserName || userWithSameEmail) {
            return res.json({ isUnique: false });
        }

        res.json({ isUnique: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings'))
    }
}