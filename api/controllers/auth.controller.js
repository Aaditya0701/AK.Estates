import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

//signup page functionality
export const signup = async (req, res, next) => {
    const { userName, email, password, confirmPassword } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); //encrypting the password
    const newUser = new User({ userName, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json('user created successfully');
    } catch (error) { // if finds any duplicate value
        next(error);
    }

};

//signin page sunctionality
/* export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User Not Found'));
        const validPswd = bcryptjs.compareSync(password, validUser.password);
        if (!validPswd) return next(errorHandler(404, 'Invalid Password'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: pswd, ...rest} = validUser._doc //not to sent value of password in res.json(rest) 👇🏻
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest); // 👈🏻
    } catch (error) {
        next(error);
    }
} */
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User Not Found'));

        const validPswd = bcryptjs.compareSync(password, validUser.password);
        if (!validPswd) return next(errorHandler(404, 'Invalid Password'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pswd, ...rest } = validUser._doc;

        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json({ success: true, ...rest });
    } catch (error) {
        next(error);
    }
};