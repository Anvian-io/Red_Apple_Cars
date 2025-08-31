import Feedback from "../../models/feedback.js";

import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";

// Create Role
export const createOrUpdateFeedback = asyncHandler(async (req, res) => {
    const { feedback_id, CustomerName, Testimonial, rating, Status } = req.body;

    // Validate input
    if (!CustomerName || !Testimonial || !rating || !Status) {
        return sendResponse(
            res,
            false,
            null,
            "All fields are required",
            statusType.BAD_REQUEST
        );
    }

    let feedback;

    if (feedback_id) {
        // ✅ Update existing feedback
        feedback = await Feedback.findByIdAndUpdate(
            feedback_id,
            { CustomerName, Testimonial, rating, Status },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return sendResponse(
                res,
                false,
                null,
                "Feedback not found",
                statusType.NOT_FOUND
            );
        }
    } else {
        // ✅ Create new feedback
        feedback = await Feedback.create({
            CustomerName,
            Testimonial,
            rating,
            Status
        });
    }

    const message = feedback_id
        ? "Feedback updated successfully"
        : "Feedback created successfully";

    return sendResponse(res, true, feedback, message, statusType.SUCCESS);
});

export const getAllFeedback = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // newest first
    return sendResponse(
        res,
        true,
        feedbacks,
        "All feedback fetched successfully",
        statusType.SUCCESS
    );
});

// ✅ Get single feedback by ID
export const getFeedback = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
        return sendResponse(
            res,
            false,
            null,
            "Feedback not found",
            statusType.NOT_FOUND
        );
    }

    return sendResponse(
        res,
        true,
        feedback,
        "Feedback fetched successfully",
        statusType.SUCCESS
    );
});

// ✅ Delete feedback by ID
export const deleteFeedback = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
        return sendResponse(
            res,
            false,
            null,
            "Feedback not found",
            statusType.NOT_FOUND
        );
    }

    return sendResponse(
        res,
        true,
        null,
        "Feedback deleted successfully",
        statusType.SUCCESS
    );
});
