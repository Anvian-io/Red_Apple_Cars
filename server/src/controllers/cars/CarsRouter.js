// routes/carRoutes.js
import express from "express";
import {
    createOrUpdateCar,
    getAllCars,
    getCar,
    deleteCar,
    deleteMainImage,
    deleteOtherImage,
    getAllZambiaCars,
    getAllBotswanaCars,
    getAllCars_for_user,
    exportCarsToExcel,
    exportCarsToExcelWithHyperlinks
} from "./CarsController.js";
// import { protect } from "../middleware/authMiddleware.js";
import upload from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected
// router.use(protect);

router.route("/").get(getAllCars);

router.post("/create",
    upload.fields([
        { name: "main_image", maxCount: 1 },
        { name: "other_images", maxCount: 10 }
    ]),
    createOrUpdateCar
);

router.get("/zambia", getAllZambiaCars);

router.get("/botswana", getAllBotswanaCars);

router.get("/getAll", getAllCars);

router.route("/:id").get(getCar).delete(deleteCar);

router.route("/:id/main-image").delete(deleteMainImage);

router.route("/:carId/other-images/:imageId").delete(deleteOtherImage);

router.get("/export/excel", exportCarsToExcel);

router.get("/export/excel-with-hyperlinks", exportCarsToExcelWithHyperlinks);

export default router;
