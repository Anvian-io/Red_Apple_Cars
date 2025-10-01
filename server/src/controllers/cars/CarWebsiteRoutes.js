// routes/carRoutes.js
import express from "express";
import {
    getAllCars_for_user,
    getCar
} from "./CarsController.js";
// import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

router.get("/getCar/:id", getCar);
router.get("/getAllUnsoldCars", getAllCars_for_user);

export default router;
