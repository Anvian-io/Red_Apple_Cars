import { PdfService } from "../../../services/pdfService.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";
import { uploadOnCloudinary } from "../../utils/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Invoice from "../../models/Invoice.js";

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

        const newInvoice = new Invoice({
            car_id: vehicle.carId, // pass carId in request body
            customer_name: customer.name,
            pdf_url: cloudinaryResponse.secure_url,
            status: true, // default status, you can adjust
            created_by: req.user._id, // assuming JWT middleware sets req.user
            updated_by: req.user._id
        });

        await newInvoice.save();

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

// export const createInvoice = asyncHandler(async (req, res) => {
//     const { car_id, customer_name, status } = req.body;

//     // Validate required fields
//     if (!car_id || !customer_name) {
//         return sendResponse(
//             res,
//             false,
//             null,
//             "Car ID and customer name are required",
//             statusType.BAD_REQUEST
//         );
//     }

//     // Handle PDF upload
//     let pdfUrl = null;
//     if (req.files && req.files.pdf) {
//         const pdfPath = req.files.pdf[0].path;
//         const uploadedPdf = await uploadOnCloudinary(pdfPath);
//         pdfUrl = uploadedPdf.url;
//     }

//     const invoice = await Invoice.create({
//         car_id,
//         customer_name,
//         pdf_url: pdfUrl,
//         status: status || "draft",
//         created_by: req.user._id,
//         updated_by: req.user._id
//     });

//     return sendResponse(res, true, { invoice }, "Invoice created successfully", statusType.SUCCESS);
// });

// Get All Invoices with Pagination
export const getAllInvoices = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter)
        .populate("car_id", "name car_index_id car_company")
        .populate("created_by", "name email")
        .populate("updated_by", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalInvoices = await Invoice.countDocuments(filter);
    const totalPages = Math.ceil(totalInvoices / limit);

    return sendResponse(
        res,
        true,
        {
            invoices,
            pagination: {
                totalPages,
                currentPage: page,
                totalInvoices,
                itemsPerPage: limit
            }
        },
        "Invoices fetched successfully",
        statusType.OK
    );
});

// Get Single Invoice
export const getInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
        .populate("car_id")
        .populate("created_by", "name email")
        .populate("updated_by", "name email");

    if (!invoice) {
        return sendResponse(res, false, null, "Invoice not found", statusType.NOT_FOUND);
    }

    return sendResponse(res, true, { invoice }, "Invoice fetched successfully", statusType.OK);
});

// Update Invoice
export const updateInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { customer_name, status } = req.body;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
        return sendResponse(res, false, null, "Invoice not found", statusType.NOT_FOUND);
    }

    // Handle PDF update if provided
    if (req.files && req.files.pdf) {
        // Delete old PDF if exists
        if (invoice.pdf_url) {
            await deleteOnCloudinary(invoice.pdf_url);
        }

        // Upload new PDF
        const pdfPath = req.files.pdf[0].path;
        const uploadedPdf = await uploadOnCloudinary(pdfPath);
        invoice.pdf_url = uploadedPdf.url;
    }

    invoice.customer_name = customer_name || invoice.customer_name;
    invoice.status = status || invoice.status;
    invoice.updated_by = req.user._id;

    await invoice.save();

    return sendResponse(res, true, { invoice }, "Invoice updated successfully", statusType.OK);
});

// Delete Invoice
export const deleteInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
        return sendResponse(res, false, null, "Invoice not found", statusType.NOT_FOUND);
    }

    // Delete PDF from Cloudinary if exists
    if (invoice.pdf_url) {
        await deleteOnCloudinary(invoice.pdf_url);
    }

    await Invoice.findByIdAndDelete(id);

    return sendResponse(res, true, null, "Invoice deleted successfully", statusType.OK);
});
