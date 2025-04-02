import mongoose from "mongoose";

const purchaseSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    orderId:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
});

const Purchase = mongoose.model("purchases", purchaseSchema);

export default Purchase;