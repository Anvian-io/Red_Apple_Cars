import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        regNumber: {
            type: String,
            required: true,
            trim: true
        },
        vatNumber: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        whatsappNumber: {
            type: String,
            trim: true
        },
        instagramUrl: {
            type: String,
            trim: true
        },
        facebookUrl: {
            type: String,
            trim: true
        },
        twitterUrl: {
            type: String,
            trim: true
        },
        logo: {
            type: String // URL to the logo image
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

export default mongoose.model("Company", companySchema);
