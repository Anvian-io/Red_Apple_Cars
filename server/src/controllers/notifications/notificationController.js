import {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../../utils/notificationHelper.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";

// Get user notifications
export const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getUserNotifications(req.user._id, page, limit);

    return sendResponse(res, true, result, "Notifications fetched successfully", statusType.OK);
});

// Mark notification as read
export const readNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const notification = await markAsRead(id, req.user._id);

    if (!notification) {
        return sendResponse(res, false, null, "Notification not found", statusType.NOT_FOUND);
    }

    return sendResponse(res, true, notification, "Notification marked as read", statusType.OK);
});

// Mark all notifications as read
export const readAllNotifications = asyncHandler(async (req, res) => {
    const result = await markAllAsRead(req.user._id);

    return sendResponse(res, true, result, "All notifications marked as read", statusType.OK);
});

// Delete notification
export const removeNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const notification = await deleteNotification(id, req.user._id);

    if (!notification) {
        return sendResponse(res, false, null, "Notification not found", statusType.NOT_FOUND);
    }

    return sendResponse(res, true, null, "Notification deleted successfully", statusType.OK);
});
