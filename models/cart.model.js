import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    productId:{
        type:Number,
        required:true
    },
    qnty:{
        type:Number,
        required:true
    },
    dish:{
        type:String,
        required:true
    },
    somedata:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
})

const  CartModel = mongoose.model('cart', cartSchema);
export default CartModel;

