import Feedback from "../../models/feedback.js";
import mongoose from "mongoose";
import { asyncHandler, sendResponse, statusType, uploadOnCloudinary } from "../../utils/index.js";

// Create Role
export const createOrUpdateFeedback = asyncHandler(async (req, res) => {
    const { feedback_id, CustomerName, Testimonial, rating, Status } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;
    const imageUrl = imageFile ? await uploadOnCloudinary(imageFile.path) : null;
    const image = imageUrl?.url;

    
    // Validate input
    if (!CustomerName || !Testimonial || !rating || !Status || !image) {

        return sendResponse(
            res,
            false,
            null,
            "All fields are not required",
            statusType.BAD_REQUEST
        );
    }

    let feedback;
    const session = await mongoose.startSession();
    session.startTransaction();

    // try{
    //     if(feedback_id){
    //         //update existing feedback
    //         feedback =await Feedback.findById(feedback_id).session(session);
    //         if(!feedback){
    //             await session.abortTransaction();
    //             session.endSession();
    //             return sendResponse(res, false, null, "feedback not found", statusType.NOT_FOUND);
    //         }


    //     }
    // }catch(error){

    // }

    if (feedback_id) {
        // ✅ Update existing feedback
        feedback = await Feedback.findByIdAndUpdate(
            feedback_id,
            { CustomerName, Testimonial, rating, Status, image },
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
            Status,
            image
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
