import express from "express";
import {
    getProfile,
    updateCompany,
    createOrUpdateBank,
    deleteBank,
    setActiveBank
} from "./profileController.js";
import upload from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getProfile);
router.put("/company", upload.single("logo"), updateCompany);
router.post("/bank", createOrUpdateBank);
router.put("/bank/:bankId/active", setActiveBank);
router.delete("/bank/:bankId", deleteBank);

export default router;
