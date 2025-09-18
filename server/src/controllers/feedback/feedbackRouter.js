import express from "express";
import { createOrUpdateFeedback, getAllFeedback, getFeedback, deleteFeedback } from "./feedbackController.js";
import upload from "../../middlewares/multer.middleware.js";
// const router = express.Router();
const feedbackRoute = express.Router();


feedbackRoute
    .route("/create")
    .post(
        upload.fields([
            { name: "image", maxCount: 1 },
        ]),
        createOrUpdateFeedback
    )
    .get(getAllFeedback);

feedbackRoute.get("/all", getAllFeedback);
feedbackRoute.get("/:id", getFeedback);
feedbackRoute.delete("/:id", deleteFeedback);

export default feedbackRoute;
