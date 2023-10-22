import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
export const isLoggedIn = async (req, res, next) => {

    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new AppError('Unauthenticated, Please login', 400));
        }

        console.log(token);

        const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDetails;
        console.log("userDetails:",userDetails);
        next();
        
    } catch (e) {
        return next(new AppError('Unauthenticated, Please login', 400));
    }
}

export const authorizedRoles = async (req, res, next) => {
    const currentUserRoles = req.user.role;

    if (currentUserRoles == "USER") {
        return next(new AppError(`You don't have permission to access this`, 403));
    }

    next();
}




