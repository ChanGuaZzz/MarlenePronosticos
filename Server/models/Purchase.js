import mongoose from "mongoose";

const purchaseSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    payerFullName: {
        type: String,
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
    value: {
        type: Number,
        required: true,
    },
});

const Purchase = mongoose.model("purchases", purchaseSchema);

export default Purchase;