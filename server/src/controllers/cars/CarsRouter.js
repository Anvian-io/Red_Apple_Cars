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
    getAllBotswanaCars
} from "./CarsController.js";
// import { protect } from "../middleware/authMiddleware.js";
import upload from "../../middlewares/multer.middleware.js";

const router = express.Router();

// All routes are protected
// router.use(protect);

router
    .route("/")
    .post(
        upload.fields([
            { name: "main_image", maxCount: 1 },
            { name: "other_images", maxCount: 10 }
        ]),
        createOrUpdateCar
    )
    .get(getAllCars);

router.get("/zambia", getAllZambiaCars);

router.get("/botswana", getAllBotswanaCars);

router.route("/:id").get(getCar).delete(deleteCar);

router.route("/:id/main-image").delete(deleteMainImage);

router.route("/:carId/other-images/:imageId").delete(deleteOtherImage);



export default router;
