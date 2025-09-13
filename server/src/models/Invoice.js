// models/Invoice.js
import mongoose from "mongoose";
import Counter from "./Counter.js";

const invoiceSchema = new mongoose.Schema(
    {
        car_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true
        },
        invoice_index_id: {
            type: String,
            unique: true
        },
        customer_name: {
            type: String,
            required: true,
            trim: true
        },
        pdf_url: {
            type: String, // Cloudinary URL
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        payment_status: {
            type: Boolean,
            required: true
        },
        payment_type: {
            type: Boolean,
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

// Pre-save hook to auto-increment invoice_index_id
invoiceSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: "invoice_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Assign the incremented value
        this.invoice_index_id = `I${counter.seq.toString().padStart(5, "0")}`;
    }
    next();
});

export default mongoose.model("Invoice", invoiceSchema);
