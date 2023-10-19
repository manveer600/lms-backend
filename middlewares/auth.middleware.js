import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
const isLoggedIn = async (req, res, next) => {

    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new AppError('Unauthenticated, Please login', 400));
        }

        console.log(token);

        const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDetails;
        next();
        
    } catch (e) {
        return next(new AppError('Unauthenticated, Please login', 400));
    }
}

export default isLoggedIn;