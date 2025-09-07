import express from "express";
import { createOrUpdateFeedback, getAllFeedback, getFeedback, deleteFeedback } from "./feedbackController.js";

// const router = express.Router();
const feedbackRoute = express.Router();
feedbackRoute.post("/create", createOrUpdateFeedback);
feedbackRoute.get("/all", getAllFeedback);
feedbackRoute.get("/:id", getFeedback);
feedbackRoute.delete("/:id", deleteFeedback);

export default feedbackRoute;
