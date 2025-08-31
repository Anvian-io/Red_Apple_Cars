// models/CarDetail.js
import mongoose from "mongoose";

const carDetailSchema = new mongoose.Schema(
    {
        car_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        engine_type: {
            type: String,
            required: true
        },
        engine_size: {
            type: String,
            required: true
        },
        transmission: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        fuel: {
            type: String,
            required: true
        },
        mileage: {
            type: Number,
            required: true
        },
        drive: {
            type: String,
            required: true
        },
        option: {
            type: String,
            required: false
        },
        location: {
            type: String,
            required: true
        },
        condition: {
            type: String,
            enum: ["new", "used"],
            required: true
        },
        duty: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["available", "sold", "reserved"],
            default: "available"
        },
        stock_no: {
            type: String,
            required: true,
            unique: true
        }
    },
    { timestamps: true }
);

carDetailSchema.index({ car_id: 1 });
carDetailSchema.index({ stock_no: 1 });

export default mongoose.model("CarDetail", carDetailSchema);
