import express from "express";
import {
    getNotifications,
    readNotification,
    readAllNotifications,
    removeNotification
} from "./notificationController.js";
// import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", readNotification);
router.patch("/read-all", readAllNotifications);
router.delete("/:id", removeNotification);

const clients = [];

router.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const clientId = Date.now();
    const client = { id: clientId, res };
    clients.push(client);

    req.on("close", () => {
        clients.splice(
            clients.findIndex((c) => c.id === clientId),
            1
        );
    });
});

export const sendNotificationToClients = (type) => {
    clients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify({ type })}\n\n`);
    });
};

export default router;
