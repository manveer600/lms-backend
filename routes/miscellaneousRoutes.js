import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {userStats} from '../controllers/miscellaneousController.js'
console.log('yahan tk ponch gya');

import express from "express";
const router = express.Router();

router.get('/admin/stats/users', isLoggedIn, authorizedRoles, userStats);

export default router;


