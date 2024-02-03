import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import emailValidator from 'email-validator';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import crypto from 'crypto';
import fs from 'fs';
import sendEmail from "../utils/sendEmail.js";
const cookieOptions = {
    expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ,
    httpOnly:true,
    secure:true,
    sameSite:"none"
}

const register = async (req, res, next) => {

    console.log(req.file);
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body);
        if (!fullName || !email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const validateEmail = emailValidator.validate(email);
        if (!validateEmail) {
            return next(new AppError('Email is not valid', 400));
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError('Email already exists', 409));
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
                const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'lms' }, (error, result) => {
                    console.log(result, error);
                });
                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    console.log(user.avatar.public_id);
                    console.log(user.avatar.secure_url);
                    // remove the file from local machine(server)
                    fs.rm(`uploads/${req.file.filename}`, (error) => {
                        if (error) {
                            console.error("Error removing the file:", error);
                        } else {
                            console.log("File removed successfully");
                        }
                    });

                }
            } catch (e) {
                return next(new AppError(e.message, 400));
            }
        }

        await user.save();




        const token = await user.generateJWTToken();
        res.cookie('token', token, cookieOptions)
        user.password = undefined;
        console.log('token ready hai',token);
        console.log(res.cookie);
        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user
        })

    } catch (e) {
        console.log(e);
        return next(new AppError(e.message, 400));
    }
}

const logout = (req, res) => {
    try {
        res
        .cookie('token', null, {
            secure: true,
            expires: new Date(Date.now()+0),
            httpOnly: true,
            sameSite:"none"
        })
        .status(200).json({
            success: true,
            message: 'User logged out successfully'
        })
    }
    catch (e) {
        return next(new AppError(e.message, 400));
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const user = await User.findOne({ email }).select('+password');


        if (!user) {
            return next(new AppError(`User doesn't exist`, 400));
        }



        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return next(new AppError('Password is incorrect', 400));
        }


        const token = await user.generateJWTToken();
        console.log("Token is:", token);
        user.password = undefined;

        res
        .cookie('token', token, cookieOptions)
        .status(200).json({
            success: true,
            message: "User LoggedIn successfully",
            user,
            Token: token
        });


    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        if(!userId){
            return next(new AppError('User not found'));
        }
        const user = await User.findById(userId);

        if(!user){
            return next(new AppError('User not found'));
        }
        res.status(200).json({
            success: true,
            message: "Fetched User Details",
            user
        })
    } catch (err) {
        return next(new AppError(err.message , 400));
    }
}




const updateUser = async (req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(200).json({
            message: "Nothing to update"
        })
    }

    const { fullName } = req.body;

    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError('No such user found in the database', 404));
    }

    if (req.body.fullName) {
        user.fullName = fullName;
    }

    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        
        user.avatar.public_id = null;
        user.avatar.secure_url = null;

        let result;
        try{
            result = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'lms' });
        }catch(e){
            console.log('Error uploading to cloudinary', error);
        }

        if (result) {
            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            console.log(user.avatar.public_id);
            console.log(user.avatar.secure_url);


            fs.unlink(`uploads/${req.file.filename}`, (error) => {
                if (error) {
                    console.error("Error removing the file:", error);
                } else {
                    console.log("File removed successfully");
                }
            });
        }
    }


    try {
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User details updated successfully"
        });
    }

    catch (e) {
        return next(new AppError(e.message, 400));
    }
}





export { register, login, logout, getProfile, updateUser };