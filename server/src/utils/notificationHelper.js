import Notification from "../models/Notification.js";

// Create a new notification
export const createNotification = async ({
    title,
    message,
    type,
}) => {
    try {
        const notification = await Notification.create({
            title,
            message,
            type,
            read:false
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Get notifications for a user
export const getallNotifications = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({read:false})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Notification.countDocuments();

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
