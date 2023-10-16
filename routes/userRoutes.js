import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js"
const router = express.Router();

import { register, login, logout, getProfile } from "../controllers/userController.js";

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn ,getProfile);


export default router;