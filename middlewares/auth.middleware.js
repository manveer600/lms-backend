import jwt from "jsonwebtoken";
const isLoggedIn = async (req,res,next)=>{
    const {token} = req.cookie;

    if(!token){
        return next(new AppError('Unauthenticated, Please login', 400));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;
    next();
}

export default isLoggedIn;