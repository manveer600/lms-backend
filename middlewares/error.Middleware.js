const errorMiddleware = (err,req,res,next) => {

    
    return res.status(err.statusCode ? err.statusCode : 500 ).json({
        success:false,
        message:err.message ? err.message : "Something went wrong",
        stack:err.stack,
    })
}

export default errorMiddleware;