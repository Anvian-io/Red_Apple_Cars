// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: false
        },
        car_company: {
            type: String,
            required: true,
            trim: true
        },
        real_price: {
            type: Number,
            required: true
        },
        actual_price: {
            type: Number,
            required: true
        },
        main_image: {
            type: String, // URL to the image
            required: false
        },
        website_state: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft"
        },
        status: {
            type: String,
            enum: ["available", "sold", "reserved"],
            default: "available"
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Indexes
carSchema.index({ name: "text", car_company: "text" });
carSchema.index({ status: 1 });
carSchema.index({ website_state: 1 });

export default mongoose.model("Car", carSchema);
