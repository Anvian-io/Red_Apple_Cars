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

export default router;
