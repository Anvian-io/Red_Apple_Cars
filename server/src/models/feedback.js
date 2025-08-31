import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        CustomerName: {
            type: String,
            required: true,
            trim: true
        },
        Testimonial: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return value.trim().length > 0;
                },
                message: "Testimonial cannot be empty"
            }
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        Status: {
            type: String,
            enum: ["published", "draft"],
            required: true,
            default: "Draft",
        }


    },
    { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
