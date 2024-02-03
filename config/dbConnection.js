import mongoose from "mongoose";

(()=>{
    try{
        mongoose.connect(MONGODB_URL).then((conn)=>{
            console.log(`Connection Successfull to database:${conn.connection.name}`);
        });
    }catch(e){
        console.log(e);
        process.exit(1);
    }
})();
