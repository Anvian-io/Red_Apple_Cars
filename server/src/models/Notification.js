import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
        }
    },
    { timestamps: true }
);

// Index for better query performance
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
