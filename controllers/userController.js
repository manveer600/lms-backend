import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import emailValidator from 'email-validator';
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import fs from 'fs';
const cookieOptions = {

    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
}

const register = async (req, res, next) => {

    console.log(req.file);
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body);
        if (!fullName || !email || !password) {
            //MERE PASS 1 ERROR OBJECT AAYA MENE USKO AAGE BHEJ DIYA AB AAGE KAHAN ?
            //AAGE MTLB ERROR.MIDDLEWARE.JS ME 
            return next(new AppError('All fields are required', 400));
        }

        const validateEmail = emailValidator.validate(email);
        if (!validateEmail) {
            return next(new AppError('Email is not valid', 400));
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError('Email already exists', 400));
        }

        //The higher the number, the more secure the hash will be, but it will also take longer to compute. Therefore, it's a balance between security and performance.
        // console.log("hashed password is :", hashedPassword);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            avatar: {
                public_id: "dummy",
                secure_url: 'dummy',
            }
        })


        if (!user) {
            return next(new AppError('User registration failed, please try again later', 400));
        }


        if (req.file) {
            console.log(req.file);
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {folder: 'lms'}, (error, result) => {
                    console.log("ab yahan kya scene h bc")
                    console.log(result, error);
                });
                if(result){
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    console.log(user.avatar.public_id);
                    console.log(user.avatar.secure_url);
                    // remove the file from local machine(server)
                    // fs.rm(`uploads/${req.file.filename}`);
                }
            } catch (e) {
                return next(new AppError(e.message, 400 ));
            }
        }

        await user.save();


        // const token = jwt.sign({
        //     id:user._id, 
        //     email:user.email, 
        //     subscription: user.subscription, 
        //     role:user.role
        // },
        // process.env.JWT_SECRET,
        // {
        //     expiresIn:process.env.JWT_EXPIRY
        // });


        const token = await user.generateJWTToken();
        res.cookie('token', token, cookieOptions)
        user.password = undefined;
        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user
        })

    } catch (e) {
        console.log("sorry paaji");
        return next(new AppError(e.message, 400));
    }
}

const logout = (req, res) => {
    try {
        res.cookie('token', null, {
            secure: true,
            maxAge: 0,
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        })
    }
    catch (e) {
        return next(new AppError(e.message, 400));
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;


    try {
        if (!email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !bcrypt.compare(password, user.password)) {
            return next(new AppError('Email or password is incorrect'), 400);
        }



        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "User LoggedIn successfully",
            user
        })


    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: "User details",
            user
        })
    } catch (err) {
        return next(new AppError("Failed to fetch profile ", 500));
    }
}


export { register, login, logout, getProfile };