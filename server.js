import { config } from 'dotenv';
config();
import "./config/dbConnection.js"
import app from './app.js';
const PORT = process.env.PORT || 5000;

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})






