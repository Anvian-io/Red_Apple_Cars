import express from "express";
import { createOrUpdateFeedback, getAllFeedback, getFeedback, deleteFeedback } from "./feedbackController.js";
// const router = express.Router();
const feedbackRoute = express.Router();


feedbackRoute.get("/all", getAllFeedback);


export default feedbackRoute;
