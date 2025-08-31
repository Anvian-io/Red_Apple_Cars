// models/CarMoreInfo.js
import mongoose from "mongoose";

const carMoreInfoSchema = new mongoose.Schema(
    {
        car_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true
        },
        Tp: {
            type: Number,
            required: false
        },
        cost: {
            type: Number,
            required: false
        },
        duty: {
            type: Number,
            required: false
        },
        t_cost: {
            type: Number,
            required: false
        },
        exr: {
            type: Number,
            required: false
        },
        k_price: {
            type: Number,
            required: false
        },
        sold_price: {
            type: Number,
            required: false
        },
        discount: {
            type: Number,
            required: false
        },
        profit: {
            type: Number,
            required: false
        },
        comm: {
            type: Number,
            required: false
        },
        net_profit: {
            type: Number,
            required: false
        },
        sold_date: {
            type: Date,
            required: false
        },
        sold_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        customer_name: {
            type: String,
            required: false
        },
        customer_address: {
            type: String,
            required: false
        },
        customer_phone_no: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

carMoreInfoSchema.index({ car_id: 1 });
carMoreInfoSchema.index({ sold_date: 1 });

export default mongoose.model("CarMoreInfo", carMoreInfoSchema);
