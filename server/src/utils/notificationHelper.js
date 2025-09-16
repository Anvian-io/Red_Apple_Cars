import Notification from "../models/Notification.js";

// Create a new notification
export const createNotification = async ({
    title,
    message,
    type = "system",
    related_model = "System",
    related_id = null,
    recipient,
    priority = "medium"
}) => {
    try {
        const notification = await Notification.create({
            title,
            message,
            type,
            related_model,
            related_id,
            recipient,
            priority
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Get notifications for a user
export const getUserNotifications = async (userId, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("related_id")
            .populate("recipient", "name email");

        const total = await Notification.countDocuments({ recipient: userId });

        return {
            notifications,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Mark notification as read
export const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        return notification;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

// Mark all notifications as read
export const markAllAsRead = async (userId) => {
    try {
        const result = await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        return result;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};

// Delete a notification
export const deleteNotification = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        return notification;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};
