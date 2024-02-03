import mongoose from "mongoose";
import jwt  from "jsonwebtoken";
import crypto from 'crypto';
const userSchema  = mongoose.Schema({
    fullName: {
        type : String,
        required:[true,"Name is required"],
        minLength:[5, 'Name must be atleast 5 character'],
        maxLength:[50,"Name should be less than 50 characters"],
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        lowercase:true,
        trim:true,
        unique:true,
        match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please fill in a valid email address"]
    },
    password:{
        type:'String',
        required:[true,"Password is required"],
        minLength:[8, 'Password must be at least 8 characters long'],
        select: false
    },
    avatar:{
        public_id:{
            type:"String"
        },
        secure_url:{
            type:"String"
        },
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:'USER',
    },
    
},{ timeStamps:true});


userSchema.methods = {
    generateJWTToken: async function(){
        return await jwt.sign(
            {
                id:this._id, 
                email:this.email, 
            },
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY
            }
        )

    },
}
const User = mongoose.model('User', userSchema);

export default User;