import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
import User from "../models/user.model.js";
export const isLoggedIn = async(req, res, next) => {
    console.log("trying to log in");
    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new AppError('Unauthenticated, Please login', 400));
        }

        console.log(token);

        const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDetails;
        console.log('req.user is:', req.user);       
         next();
        
    } catch (e) {
        return next(new AppError('Unauthenticated, Please login', 400));
    }
}

export const authorizedRoles = async(req, res, next) => {
    const currentUserRole = req.user.role;

    if (currentUserRole == "USER") {
        return next(new AppError(`You don't have permission to access this`, 403));
    }
    else{ 
        next()
    };
}


export const authorizedSubscribers = async (req,res,next) =>{
    const user = await User.findById(req.user.id);
    console.log("authorizedSubscribers me user aa rha hai :", user);
    if(user.role !== 'ADMIN' && user.subscription.status !== 'active'){
        console.log("bhai ya toh admin se hato ya fir pehle subscription le kr aao")
        return next(new AppError('Access denied! You are not a subscriber or your subscription has been cancelled',403));
    }
    next();
}




