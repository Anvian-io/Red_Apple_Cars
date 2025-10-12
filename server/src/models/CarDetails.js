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
            required: false
        },
        engine_type: {
            type: String,
            required: false
        },
        engine_size: {
            type: String,
            required: false
        },
        transmission: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        fuel: {
            type: String,
            required: false
        },
        mileage: {
            type: String,
            required: false
        },
        drive: {
            type: String,
            required: false
        },
        option: {
            type: String,
            required: false
        },
        location: {
            type: String,
            required: false
        },
        condition: {
            type: String,
            required: false
        },
        duty: {
            type: String,
            required: false
        },
        stock_no: {
            type: String,
            required: false,
        }
    },
    { timestamps: true }
);

carDetailSchema.index({ car_id: 1 });
// carDetailSchema.index({ stock_no: 1 });

export default mongoose.model("CarDetail", carDetailSchema);
