import CartModel from "../models/cart.model.js";
import AppError from "../utils/error.utils.js";
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const entryToBeDeleted = await CartModel.findOne({productId:productId, userId:userId});
        if(entryToBeDeleted.qnty > 1){
            entryToBeDeleted.qnty --;
        }
        else if(entryToBeDeleted.qnty == 1){
            await CartModel.deleteOne({productId:productId, userId:userId});
        }
        await entryToBeDeleted.save();
        return res.status(200).json({
            success: true,
            message: 'Cart Deleted Successfully',
        })
    } catch (e) {
    }
}

const registerProduct = async (req, res) => {
    try {
        const { id, dish, somedata, price, rating, qnty } = req.body;
        const userId = req.user.id;

        let product = await CartModel.findOne({ userId: userId, productId:id});

        if (product) {
            product.qnty += 1;
        } else {
            product = await CartModel.create({
                userId:userId,
                productId: id,
                qnty: 1,
                dish: dish,
                somedata: somedata,
                price: price,
                rating: rating,
            });
        }

        await product.save();

        return res.status(200).json({
            product: product,
            success: true,
            message: 'Cart added successfully',
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const getCart = async (req, res, next) => {
    try {
        const carts = await CartModel.find({userId});
        res.status(200).json({
            success: true,
            message: 'All Courses',
            carts
        })
    } catch (e) {
        return next(new AppError(e.message, 400));
    }
}

const deleteCart = async(req,res) => {
    try{
        const userId = req.user.id;
        await CartModel.deleteMany({userId});
        res.status(200).json({
            success:true,
            message:'Deleted'
        })
    }catch(e){
        console.log(e);
    }
}


export { deleteProduct, registerProduct, getCart, deleteCart };