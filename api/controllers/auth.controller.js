import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';

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