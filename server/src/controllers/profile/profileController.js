import Company from "../../models/Company.js";
import Bank from "../../models/Bank.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import { createNotification } from "../../utils/notificationHelper.js";
import role from "../../models/role.js";
// import { sendNotificationToClients } from "../notifications/notificationRoute.js";

// Get Profile Data
export const getProfile = asyncHandler(async (req, res) => {
    console.log("user:- ",req.user._id);
    const company = await Company.findOne({ created_by: req.user._id });
    const banks = await Bank.find({ created_by: req.user._id }).sort({
        isActive: -1,
        createdAt: -1
    });

    return sendResponse(
        res,
        true,
        { company, banks },
        "Profile data fetched successfully",
        statusType.SUCCESS
    );
});

// Update Company Details
export const updateCompany = asyncHandler(async (req, res) => {
    const {
        name,
        regNumber,
        vatNumber,
        address,
        phoneNumber,
        whatsappNumber,
        instagramUrl,
        facebookUrl,
        twitterUrl
    } = req.body;

    if (!name || !regNumber) {
        return sendResponse(
            res,
            false,
            null,
            "Company name and registration number are required",
            statusType.BAD_REQUEST
        );
    }

    let company = await Company.findOne({ created_by: req.user._id });

    if (company) {
        // Update existing company
        company.name = name;
        company.regNumber = regNumber;
        company.vatNumber = vatNumber;
        company.address = address;
        company.phoneNumber = phoneNumber;
        company.whatsappNumber = whatsappNumber;
        company.instagramUrl = instagramUrl;
        company.facebookUrl = facebookUrl;
        company.twitterUrl = twitterUrl;
        company.updated_by = req.user._id;

        // Handle logo upload if provided
        if (req.file) {
            // Delete old logo if exists
            if (company.logo) {
                await deleteOnCloudinary(company.logo);
            }

            // Upload new logo
            const logoPath = req.file.path;
            const logo = await uploadOnCloudinary(logoPath);
            company.logo = logo.url;
        }

        await company.save();
    } else {
        // Create new company
        let logoUrl = null;
        if (req.file) {
            const logoPath = req.file.path;
            const logo = await uploadOnCloudinary(logoPath);
            logoUrl = logo.url;
        }

        company = await Company.create({
            name,
            regNumber,
            vatNumber,
            address,
            phoneNumber,
            whatsappNumber,
            instagramUrl,
            facebookUrl,
            twitterUrl,
            logo: logoUrl,
            created_by: req.user._id,
            updated_by: req.user._id
        });
    }

    const Role = await role.findById({ _id: req.user.role });

    await createNotification({
        title: "Company details updated",
        message: `Company details updated by ${Role.name}: ${req.user.name}`,
        type: "update"
    });

    // sendNotificationToClients("notification_update");

    return sendResponse(
        res,
        true,
        { company },
        "Company details updated successfully",
        statusType.SUCCESS
    );
});

// Create or Update Bank
export const createOrUpdateBank = asyncHandler(async (req, res) => {
    const {
        bankId,
        bankName,
        accountName,
        accountNumber,
        branchCode,
        swiftCode,
        address,
        currency,
        isActive
    } = req.body;

    if (!bankName || !accountName || !accountNumber || !branchCode || !currency) {
        return sendResponse(
            res,
            false,
            null,
            "Bank name, account name, account number, branch code and currency are required",
            statusType.BAD_REQUEST
        );
    }

    // Validate currency
    if (!["bwp", "zmw"].includes(currency)) {
        return sendResponse(
            res,
            false,
            null,
            "Invalid currency. Must be either 'bwp' or 'zmw'",
            statusType.BAD_REQUEST
        );
    }

    // If setting as active, deactivate all other banks
    if (isActive === "true") {
        await Bank.updateMany({ created_by: req.user._id }, { $set: { isActive: false } });
    }

    let bank;

    if (bankId) {
        // Update existing bank
        bank = await Bank.findOne({ _id: bankId, created_by: req.user._id });

        if (!bank) {
            return sendResponse(res, false, null, "Bank not found", statusType.NOT_FOUND);
        }

        bank.bankName = bankName;
        bank.accountName = accountName;
        bank.accountNumber = accountNumber;
        bank.branchCode = branchCode;
        bank.swiftCode = swiftCode;
        bank.address = address;
        bank.currency = currency;
        bank.isActive = isActive === "true";
        bank.updated_by = req.user._id;

        await bank.save();
    } else {
        // Create new bank
        bank = await Bank.create({
            bankName,
            accountName,
            accountNumber,
            branchCode,
            swiftCode,
            address,
            currency,
            isActive: isActive === "true",
            created_by: req.user._id,
            updated_by: req.user._id
        });
    }

    const action = bankId ? "updated" : "created";
    const Role = await role.findById({ _id: req.user.role });

    await createNotification({
        title: `Bank account ${action}`,
        message: `Bank account ${action} by ${Role.name}: ${req.user.name}`,
        type: action
    });

    // sendNotificationToClients("notification_update");

    const message = bankId
        ? "Bank account updated successfully"
        : "Bank account created successfully";
    return sendResponse(res, true, { bank }, message, statusType.SUCCESS);
});

// Delete Bank
export const deleteBank = asyncHandler(async (req, res) => {
    const { bankId } = req.params;

    const bank = await Bank.findOne({ _id: bankId, created_by: req.user._id });

    if (!bank) {
        return sendResponse(res, false, null, "Bank not found", statusType.NOT_FOUND);
    }

    await Bank.findByIdAndDelete(bankId);

    const Role = await role.findById({ _id: req.user.role });

    await createNotification({
        title: "Bank account deleted",
        message: `Bank account deleted by ${Role.name}: ${req.user.name}`,
        type: "delete"
    });

    // sendNotificationToClients("notification_update");

    return sendResponse(res, true, null, "Bank account deleted successfully", statusType.SUCCESS);
});

// Set Active Bank
export const setActiveBank = asyncHandler(async (req, res) => {
    const { bankId } = req.params;
    const { currency } = req.body;
    // Deactivate all banks
    await Bank.updateMany({ currency: currency }, { $set: { isActive: false } });

    // Activate the selected bank
    const bank = await Bank.findOneAndUpdate(
        { _id: bankId, created_by: req.user._id },
        { $set: { isActive: true } },
        { new: true }
    );

    if (!bank) {
        return sendResponse(res, false, null, "Bank not found", statusType.NOT_FOUND);
    }

    const Role = await role.findById({ _id: req.user.role });

    await createNotification({
        title: "Active bank account changed",
        message: `Active bank account changed by ${Role.name}: ${req.user.name}`,
        type: "update"
    });

    // sendNotificationToClients("notification_update");

    return sendResponse(
        res,
        true,
        { bank },
        "Active bank account updated successfully",
        statusType.SUCCESS
    );
});
