import { config } from 'dotenv';
import "./config/dbConnection.js"
import Razorpay from 'razorpay';
config();
import app from './app.js';
const PORT = process.env.PORT || 5000;

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
});
let razorpay;
export default razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})