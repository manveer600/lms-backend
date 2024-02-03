import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
import User from "../models/user.model.js";
export const isLoggedIn = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return next(new AppError('Unauthenticated, Please login', 400));
        }


        const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDetails;
        console.log('req.user is:', req.user);       
        return next();
        
    } catch (e) {
        return next(new AppError('Unauthenticated, Please login', 400));
    }
}




