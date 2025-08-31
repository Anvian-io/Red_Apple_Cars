// models/CarImage.js
import mongoose from "mongoose";

const carImageSchema = new mongoose.Schema(
    {
        car_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true
        },
        image_url: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

carImageSchema.index({ car_id: 1 });

export default mongoose.model("CarImage", carImageSchema);
