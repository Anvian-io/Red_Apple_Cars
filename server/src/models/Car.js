// models/Car.js
import mongoose from "mongoose";
import Counter from "./Counter.js";

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        car_index_id: {
            type: String, // Keep string if you want "C00001"
            unique: true
        },
        description: {
            type: String
        },
        car_company: {
            type: String,
            required: true,
            trim: true
        },
        // Pula (Botswana) prices
        real_price_bwp: {
            type: Number,
            required: true
        },
        actual_price_bwp: {
            type: Number,
            required: true
        },
        // Zambian Kwacha prices
        real_price_zmw: {
            type: Number,
            required: true
        },
        actual_price_zmw: {
            type: Number,
            required: true
        },
        main_image: {
            type: String // URL to the image
        },
        website_state: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["unsold", "pending","sold"],
            default:"unsold",
            required: true
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

// Pre-save hook to auto-increment car_index_id
carSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: "car_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Assign the incremented value
        this.car_index_id = `C${counter.seq.toString().padStart(5, "0")}`;
    }
    next();
});

// Indexes
carSchema.index({ name: "text", car_company: "text" });

export default mongoose.model("Car", carSchema);
