import express from "express";
import {
    generateInvoice,
    getInvoice,
    getAllInvoices,
    updateInvoice,
    deleteInvoice,
    update_invoice_car_details
} from "./invoiceController.js";

const router = express.Router();

router.post("/generate", generateInvoice);
router.post("/update_invoice_car_details", update_invoice_car_details);
router.route("/").get(getAllInvoices);

router
    .route("/:id")
    .get(getInvoice)
    // .put(upload.single("pdf"), updateInvoice)
    .delete(deleteInvoice);


export default router;
