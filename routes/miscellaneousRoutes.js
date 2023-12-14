import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {userStats, contactUs} from '../controllers/miscellaneousController.js'
console.log('yahan tk ponch gya');

import express from "express";
const router = express.Router();

router.get('/admin/stats/users', isLoggedIn, authorizedRoles, userStats);
router.post('/contact', isLoggedIn, contactUs )
export default router;


