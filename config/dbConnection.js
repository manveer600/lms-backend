import mongoose from "mongoose";

(()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/LMS").then((conn)=>{
            console.log(`Connection Successfull to database:${conn.connection.name}`);
        });
    }catch(e){
        console.log(e);
        process.exit(1);
    }
})();
