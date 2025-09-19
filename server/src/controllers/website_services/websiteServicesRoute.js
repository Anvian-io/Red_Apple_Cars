// routes/carRoutes.js
import express from "express";

// import { protect } from "../middleware/authMiddleware.js";
import upload from "../../middlewares/multer.middleware.js";
import { name } from "./websiteServicesController.js";
const router = express.Router();


// router.route("/").get(getAllCars);
router.post("/name", name);
// "http://localhost:8000/api/suthakar/name"


export default router;
