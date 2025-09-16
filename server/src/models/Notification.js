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
            enum: ["car_created", "car_updated", "car_sold", "system"],
            default: "system"
        },
        related_model: {
            type: String,
            enum: ["Car", "User", "System"],
            default: "System"
        },
        related_id: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "related_model"
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        }
    },
    { timestamps: true }
);

// Index for better query performance
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
