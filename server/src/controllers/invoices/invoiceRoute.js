import express from "express";
import { generateInvoice, getInvoice } from "./invoiceController.js";

const router = express.Router();

router.post("/generate", generateInvoice);
router.get("/:filename", getInvoice);

export default router;
