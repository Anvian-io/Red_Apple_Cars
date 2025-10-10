import {
    createNotification,
    getallNotifications,
} from "../../utils/notificationHelper.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";

// Get user notifications
export const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getallNotifications(page, limit);

    return sendResponse(res, true, result, "Notifications fetched successfully", statusType.OK);
});

