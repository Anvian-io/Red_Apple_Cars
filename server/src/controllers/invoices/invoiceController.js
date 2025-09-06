import { PdfService } from "../../../services/pdfService.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";
import { uploadOnCloudinary } from "../../utils/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = asyncHandler(async (req, res) => {
    const { company, customer, banking, vehicle, price, invoice } = req.body;

    if (!company || !customer || !banking || !vehicle || !price || !invoice) {
        return sendResponse(
            res,
            false,
            null,
            "Missing required invoice data",
            statusType.BAD_REQUEST
        );
    }

    const filename = `invoice_${invoice.documentNumber}_${Date.now()}.pdf`;

    const terms = [
        'All cars sold "AS IS" and Does not include any warranty or Guarantee',
        "If paying in ZAR Rates of Exchange will have to be obtained on the day of effecting transaction. Kindly talk to our team to obtain an exchange rate.",
        "All bank transaction fees must be paid by the purchaser",
        "Cash deposits done to a South African bank will attract a further 2.5% cash deposit fee.",
        "Credit card payments will have attract a further 2% transaction fee",
        "Should you pay and decide to cancel your order you will be charged PULA 200 as cancellation fee.",
        "The Pictures and Information given are to the best of our ability in the event they don't match the product in the exact manner UFS Africa cannot be held liable.",
        "In the event of hijack or an accident where the vehicle is written off, invoice value would be the maximum value to be claimed under insurance."
    ];

    const contact = {
        address: "Old International Airport, Isipingo, Durban 4133",
        email: "accounts@ufsauto.com",
        website: "www.ufsauto.com",
        phone: "+27 84 786 5492"
    };

    const data = {
        company: {
            logo: "https://res.cloudinary.com/dcg8mpgar/image/upload/v1757176857/Untitled_design__1_-removebg-preview_rpdk9q.png",
            ...company
        },
        customer,
        banking,
        vehicle,
        price,
        invoice,
        terms,
        contact
    };

    try {
        // Generate PDF in local path
        const relativePath = await PdfService.generatePdf("invoice", data, filename);

        // Resolve absolute path: goes up from controllers/... to public/invoices
        const localFilePath = path.join(__dirname, "../../../public", relativePath);

        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        // Optionally delete local file after upload
        // if (fs.existsSync(localFilePath)) {
        //     fs.unlinkSync(localFilePath);
        // }

        return sendResponse(
            res,
            true,
            { pdfUrl: cloudinaryResponse.secure_url },
            "Invoice generated & uploaded successfully",
            statusType.OK
        );
    } catch (error) {
        console.error("Error generating invoice:", error);
        return sendResponse(
            res,
            false,
            null,
            "Failed to generate invoice",
            statusType.INTERNAL_SERVER_ERROR
        );
    }
});

export const getInvoice = asyncHandler(async (req, res) => {
    const { filename } = req.params;

    // Security check to prevent directory traversal
    if (filename.includes("..") || filename.includes("/")) {
        return sendResponse(res, false, null, "Invalid filename", statusType.BAD_REQUEST);
    }

    const filePath = path.join(__dirname, "../public/invoices", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return sendResponse(res, false, null, "Invoice not found", statusType.NOT_FOUND);
    }

    // Send the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
});
