import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
    {
        bankName: {
            type: String,
            required: true,
            trim: true
        },
        accountName: {
            type: String,
            required: true,
            trim: true
        },
        accountNumber: {
            type: String,
            required: true,
            trim: true
        },
        branchCode: {
            type: String,
            required: true,
            trim: true
        },
        swiftCode: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: false
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

export default mongoose.model("Bank", bankSchema);
