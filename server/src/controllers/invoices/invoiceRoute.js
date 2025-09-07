import express from "express";
import {
    generateInvoice,
    getInvoice,
    getAllInvoices,
    updateInvoice,
    deleteInvoice
} from "./invoiceController.js";

const router = express.Router();

router.post("/generate", generateInvoice);
router.route("/").get(getAllInvoices);

router
    .route("/:id")
    .get(getInvoice)
    // .put(upload.single("pdf"), updateInvoice)
    .delete(deleteInvoice);


export default router;
