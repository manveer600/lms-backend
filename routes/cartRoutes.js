import express from "express";
import { deleteProduct, registerProduct, getCart, deleteCart  } from "../controllers/cartController.js";
const router = express.Router();
router.get('/', getCart)
router.post(`/register`,registerProduct);
// router.delete(`/delete/:productId` , deleteProduct);
router.delete('/delete/all', deleteCart);
export default router;