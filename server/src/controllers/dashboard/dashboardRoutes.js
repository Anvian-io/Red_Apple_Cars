// routes/dashboardRoutes.js
import express from "express";
import { getDashboardData, getRecentSoldCars } from "./dashboardController.js";

const router = express.Router();

router.get("/data", getDashboardData);
router.get("/recent-sold", getRecentSoldCars);

export default router;
