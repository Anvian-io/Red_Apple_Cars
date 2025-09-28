// controllers/carController.js
import Car from "../../models/Car.js";
import role from "../../models/role.js";
import CarDetail from "../../models/CarDetails.js";
import CarMoreInfo from "../../models/CarMoreInfo.js";
import CarImage from "../../models/CarImage.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import { createNotification } from "../../utils/notificationHelper.js";
import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { sendNotificationToClients } from "../notifications/notificationRoute.js";


// Create or Update Car
export const createOrUpdateCar = asyncHandler(async (req, res) => {
    const {
        car_id,
        name,
        description,
        car_company,
        real_price_bwp,
        actual_price_bwp,
        real_price_zmw,
        actual_price_zmw,
        website_state,
        status,
        // Details
        year,
        engine_type,
        engine_size,
        transmission,
        color,
        fuel,
        mileage,
        drive,
        option,
        location,
        condition,
        duty,
        stock_no,
        // More info
        Tp,
        cost,
        duty_more,
        t_cost,
        exr,
        k_price,
        sold_price,
        discount,
        profit,
        comm,
        net_profit,
        sold_date,
        sold_by,
        customer_name,
        customer_address,
        customer_phone_no
    } = req.body;

    // Validate required fields
    if (
        !name ||
        !car_company ||
        !real_price_bwp ||
        !actual_price_bwp ||
        !real_price_zmw ||
        !actual_price_zmw
    ) {
        return sendResponse(
            res,
            false,
            null,
            "Name, company, and all price fields are required",
            statusType.BAD_REQUEST
        );
    }

    let car;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (car_id) {
            // Update existing car
            car = await Car.findById(car_id).session(session);
            if (!car) {
                await session.abortTransaction();
                session.endSession();
                return sendResponse(res, false, null, "Car not found", statusType.NOT_FOUND);
            }

            // Update car details
            car.name = name;
            car.description = description;
            car.car_company = car_company;
            car.real_price_bwp = real_price_bwp;
            car.actual_price_bwp = actual_price_bwp;
            car.real_price_zmw = real_price_zmw;
            car.actual_price_zmw = actual_price_zmw;
            car.website_state = website_state;
            car.status = status || car.status;
            car.updated_by = req.user._id;

            // console.log(car,"fwejoifhwoi")
            // Handle main image upload if provided
            console.log(req.files, "fweoif");
            if (req.files && req.files.main_image) {
                // Delete old image if exists
                console.log("fjewoife");
                if (car.main_image) {
                    await deleteOnCloudinary(car.main_image);
                }

                // Upload new image
                const mainImagePath = req.files.main_image[0].path;
                const mainImage = await uploadOnCloudinary(mainImagePath);
                car.main_image = mainImage.url;
            }

            await car.save({ session });

            // Update car details
            await CarDetail.findOneAndUpdate(
                { car_id },
                {
                    year,
                    engine_type,
                    engine_size,
                    transmission,
                    color,
                    fuel,
                    mileage,
                    drive,
                    option,
                    location,
                    condition,
                    duty,
                    stock_no
                },
                { upsert: true, session }
            );

            // Update more info if provided
            if (
                Tp ||
                cost ||
                duty_more ||
                t_cost ||
                exr ||
                k_price ||
                sold_price ||
                discount ||
                profit ||
                comm ||
                net_profit ||
                sold_date ||
                sold_by ||
                customer_name ||
                customer_address ||
                customer_phone_no
            ) {
                await CarMoreInfo.findOneAndUpdate(
                    { car_id },
                    {
                        Tp,
                        cost,
                        duty: duty_more,
                        t_cost,
                        exr,
                        k_price,
                        sold_price,
                        discount,
                        profit,
                        comm,
                        net_profit,
                        sold_date,
                        sold_by,
                        customer_name,
                        customer_address,
                        customer_phone_no
                    },
                    { upsert: true, session }
                );
            }

            // Handle additional images if provided
            if (req.files && req.files.other_images) {
                const otherImages = req.files.other_images;

                for (const image of otherImages) {
                    const uploadedImage = await uploadOnCloudinary(image.path);
                    await CarImage.create(
                        [
                            {
                                car_id: car._id,
                                image_url: uploadedImage.url
                            }
                        ],
                        { session }
                    );
                }
            }
        } else {
            // Create new car
            // Handle main image upload
            let mainImageUrl = null;
            if (req.files && req.files.main_image) {
                const mainImagePath = req.files.main_image[0].path;
                const mainImage = await uploadOnCloudinary(mainImagePath);
                mainImageUrl = mainImage.url;
            }

            // Create car
            car = await Car.create(
                [
                    {
                        name,
                        description,
                        car_company,
                        real_price_bwp,
                        actual_price_bwp,
                        real_price_zmw,
                        actual_price_zmw,
                        main_image: mainImageUrl,
                        website_state: website_state || "draft",
                        status: status || "pending",
                        created_by: req.user._id,
                        updated_by: req.user._id
                    }
                ],
                { session }
            );

            // Create car details
            await CarDetail.create(
                [
                    {
                        car_id: car[0]._id,
                        year,
                        engine_type,
                        engine_size,
                        transmission,
                        color,
                        fuel,
                        mileage,
                        drive,
                        option,
                        location,
                        condition,
                        duty,
                        status: status || "pending",
                        stock_no
                    }
                ],
                { session }
            );

            // Create more info if provided
            if (
                Tp ||
                cost ||
                duty_more ||
                t_cost ||
                exr ||
                k_price ||
                sold_price ||
                discount ||
                profit ||
                comm ||
                net_profit ||
                sold_date ||
                sold_by ||
                customer_name ||
                customer_address ||
                customer_phone_no
            ) {
                await CarMoreInfo.create(
                    [
                        {
                            car_id: car[0]._id,
                            Tp,
                            cost,
                            duty: duty_more,
                            t_cost,
                            exr,
                            k_price,
                            sold_price,
                            discount,
                            profit,
                            comm,
                            net_profit,
                            sold_date,
                            sold_by,
                            customer_name,
                            customer_address,
                            customer_phone_no
                        }
                    ],
                    { session }
                );
            }

            // Handle additional images if provided
            if (req.files && req.files.other_images) {
                const otherImages = req.files.other_images;
                const carImages = [];

                for (const image of otherImages) {
                    const uploadedImage = await uploadOnCloudinary(image.path);
                    carImages.push({
                        car_id: car[0]._id,
                        image_url: uploadedImage.url
                    });
                }

                if (carImages.length > 0) {
                    await CarImage.insertMany(carImages, { session });
                }
            }
        }

        await session.commitTransaction();
        session.endSession();

        const action = car_id ? "updated" : "created";

        const Role = await role.findById({ _id: req.user.role });

        await createNotification({
            title: `Car ${action}`,
            message: `Car ${action} by ${Role.name}: ${req.user.name}`,
            type: action,
        });

        sendNotificationToClients("notification_update");

        const message = car_id ? "Car updated successfully" : "Car created successfully";
        return sendResponse(res, true, { car }, message, statusType.SUCCESS);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

//get all cars for user website
export const getAllCars_for_user = asyncHandler(async (req, res) => {
    const cars = await Car.aggregate([
        {
            $match: {
                website_state: true,
                status: "unsold"
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: "cardetails", // collection name in MongoDB (always lowercase + pluralized)
                localField: "_id",
                foreignField: "car_id",
                as: "details"
            }
        },
        {
            $unwind: {
                path: "$details",
                preserveNullAndEmptyArrays: true // keep cars even if no details
            }
        }
    ]);

    return sendResponse(
        res,
        true,
        cars,
        "All cars with details fetched successfully",
        statusType.SUCCESS
    );
});

// Get All Cars with Pagination and Search
export const getAllCars = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const website_state = req.query.website_state || "";
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { car_company: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }
    if (status) filter.status = status;
    if (website_state) filter.website_state = website_state;

    // Get cars with related data using aggregation
    const cars = await Car.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "cardetails",
                localField: "_id",
                foreignField: "car_id",
                as: "details"
            }
        },
        {
            $lookup: {
                from: "carmoreinfos",
                localField: "_id",
                foreignField: "car_id",
                as: "moreInfo"
            }
        },
        {
            $lookup: {
                from: "carimages",
                localField: "_id",
                foreignField: "car_id",
                as: "images"
            }
        },
        // Modified lookup for created_by with projection
        {
            $lookup: {
                from: "users",
                let: { createdById: "$created_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$createdById"] }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            _id: 1
                        }
                    }
                ],
                as: "created_by"
            }
        },
        // Modified lookup for updated_by with projection
        {
            $lookup: {
                from: "users",
                let: { updatedById: "$updated_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$updatedById"] }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            _id: 1
                        }
                    }
                ],
                as: "updated_by"
            }
        },
        { $unwind: { path: "$created_by", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$updated_by", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$moreInfo", preserveNullAndEmptyArrays: true } },
        { $sort: { updatedAt: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    // Get total count
    const totalCars = await Car.countDocuments(filter);
    const totalPages = Math.ceil(totalCars / limit);

    return sendResponse(
        res,
        true,
        {
            cars,
            pagination: {
                totalPages,
                currentPage: page,
                totalCars,
                itemsPerPage: limit
            }
        },
        "Cars fetched successfully",
        statusType.OK
    );
});

// Get all Zambia Cars (website_state = true, return ZMW prices)
export const getAllZambiaCars = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { website_state: true };

    const cars = await Car.find(filter)
        .populate("created_by", "name email")
        .populate("updated_by", "name email")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

    // Format with Zambia currency (ZMW)
    const formattedCars = cars.map((car) => ({
        ...car.toObject(),
        real_price: car.real_price_zmw,
        actual_price: car.actual_price_zmw,
        currency: "ZMW"
    }));

    const totalCars = await Car.countDocuments(filter);
    const totalPages = Math.ceil(totalCars / limit);

    return sendResponse(
        res,
        true,
        {
            cars: formattedCars,
            pagination: {
                totalPages,
                currentPage: page,
                totalCars,
                itemsPerPage: limit
            }
        },
        "Zambia cars fetched successfully",
        statusType.OK
    );
});

// Get all Botswana Cars (website_state = true, return BWP prices)
export const getAllBotswanaCars = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { website_state: true };

    const cars = await Car.find(filter)
        .populate("created_by", "name email")
        .populate("updated_by", "name email")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

    // Format with Botswana currency (BWP)
    const formattedCars = cars.map((car) => ({
        ...car.toObject(),
        real_price: car.real_price_bwp,
        actual_price: car.actual_price_bwp,
        currency: "BWP"
    }));

    const totalCars = await Car.countDocuments(filter);
    const totalPages = Math.ceil(totalCars / limit);

    return sendResponse(
        res,
        true,
        {
            cars: formattedCars,
            pagination: {
                totalPages,
                currentPage: page,
                totalCars,
                itemsPerPage: limit
            }
        },
        "Botswana cars fetched successfully",
        statusType.OK
    );
});

// Get Single Car with Details and More Info
export const getCar = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const car = await Car.findById(id)
        .populate("created_by", "name email")
        .populate("updated_by", "name email");

    if (!car) {
        return sendResponse(res, false, null, "Car not found", statusType.NOT_FOUND);
    }

    const carDetails = await CarDetail.findOne({ car_id: id });
    const carMoreInfo = await CarMoreInfo.findOne({ car_id: id });
    const carImages = await CarImage.find({ car_id: id });

    return sendResponse(
        res,
        true,
        { car, carDetails, carMoreInfo, carImages },
        "Car fetched successfully",
        statusType.OK
    );
});

// Delete Car
export const deleteCar = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
        return sendResponse(res, false, null, "Car not found", statusType.NOT_FOUND);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Delete main image if exists
        if (car.main_image) {
            await deleteOnCloudinary(car.main_image);
        }

        // Delete all related images
        const carImages = await CarImage.find({ car_id: id }).session(session);
        for (const image of carImages) {
            await deleteOnCloudinary(image.image_url);
        }
        await CarImage.deleteMany({ car_id: id }).session(session);

        // Delete related documents
        await CarDetail.deleteOne({ car_id: id }).session(session);
        await CarMoreInfo.deleteOne({ car_id: id }).session(session);

        // Delete the car
        await Car.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        const role = await role.findById({ _id: req.user.role });
        await createNotification({
            title: "Car deleted",
            message: `Car deleted by ${role.name}: ${req.user.name}`,
            type: "delete"
        });

        return sendResponse(res, true, null, "Car deleted successfully", statusType.OK);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// Delete Main Image
export const deleteMainImage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
        return sendResponse(res, false, null, "Car not found", statusType.NOT_FOUND);
    }

    if (!car.main_image) {
        return sendResponse(res, false, null, "No main image to delete", statusType.BAD_REQUEST);
    }

    // Delete from cloudinary
    await deleteOnCloudinary(car.main_image);

    // Update car
    car.main_image = null;
    car.updated_by = req.user._id;
    await car.save();

    return sendResponse(res, true, null, "Main image deleted successfully", statusType.OK);
});

// Delete Other Image
export const deleteOtherImage = asyncHandler(async (req, res) => {
    const { carId, imageId } = req.params;

    const car = await Car.findById(carId);
    if (!car) {
        return sendResponse(res, false, null, "Car not found", statusType.NOT_FOUND);
    }

    const image = await CarImage.findOne({ _id: imageId, car_id: carId });
    if (!image) {
        return sendResponse(res, false, null, "Image not found", statusType.NOT_FOUND);
    }

    // Delete from cloudinary
    await deleteOnCloudinary(image.image_url);

    // Delete from database
    await CarImage.findByIdAndDelete(imageId);

    return sendResponse(res, true, null, "Image deleted successfully", statusType.OK);
});

export const exportCarsToExcel = asyncHandler(async (req, res) => {
    try {
        // Fetch all cars with their related data
        const cars = await Car.aggregate([
            { $match: { website_state: true } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "cardetails",
                    localField: "_id",
                    foreignField: "car_id",
                    as: "details"
                }
            },
            {
                $lookup: {
                    from: "carimages",
                    localField: "_id",
                    foreignField: "car_id",
                    as: "images"
                }
            },
            {
                $lookup: {
                    from: "carmoreinfos",
                    localField: "_id",
                    foreignField: "car_id",
                    as: "moreInfo"
                }
            }
        ]);

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Cars Inventory");

        // Define columns with custom widths
        worksheet.columns = [
            { header: "Car Index ID", key: "car_index_id", width: 15 },
            { header: "Name", key: "name", width: 25 },
            { header: "Description", key: "description", width: 30 },
            { header: "Company", key: "car_company", width: 20 },
            { header: "Real Price (BWP)", key: "real_price_bwp", width: 18 },
            { header: "Actual Price (BWP)", key: "actual_price_bwp", width: 18 },
            { header: "Real Price (ZMW)", key: "real_price_zmw", width: 18 },
            { header: "Actual Price (ZMW)", key: "actual_price_zmw", width: 18 },
            { header: "Main Image", key: "main_image", width: 50 },
            // { header: "All Images", key: "all_images", width: 100 },
            { header: "Website State", key: "website_state", width: 15 },
            { header: "Status", key: "status", width: 12 },
            { header: "Year", key: "year", width: 10 },
            { header: "Engine Type", key: "engine_type", width: 15 },
            { header: "Engine Size", key: "engine_size", width: 15 },
            { header: "Transmission", key: "transmission", width: 15 },
            { header: "Color", key: "color", width: 15 },
            { header: "Fuel", key: "fuel", width: 12 },
            { header: "Mileage", key: "mileage", width: 15 },
            { header: "Drive", key: "drive", width: 12 },
            { header: "Option", key: "option", width: 20 },
            { header: "Location", key: "location", width: 20 },
            { header: "Condition", key: "condition", width: 15 },
            { header: "Duty", key: "duty", width: 15 },
            { header: "Stock No", key: "stock_no", width: 15 },
            { header: "TP", key: "tp", width: 12 },
            { header: "Cost", key: "cost", width: 12 },
            { header: "Duty Cost", key: "duty_cost", width: 15 },
            { header: "Total Cost", key: "t_cost", width: 15 },
            { header: "Exchange Rate", key: "exr", width: 15 },
            { header: "K Price", key: "k_price", width: 15 },
            { header: "Sold Price", key: "sold_price", width: 15 },
            { header: "Discount", key: "discount", width: 12 },
            { header: "Profit", key: "profit", width: 12 },
            { header: "Commission", key: "comm", width: 12 },
            { header: "Net Profit", key: "net_profit", width: 15 },
            { header: "Sold Date", key: "sold_date", width: 15 },
            { header: "Sold By", key: "sold_by", width: 20 },
            { header: "Customer Name", key: "customer_name", width: 25 },
            { header: "Customer Address", key: "customer_address", width: 30 },
            { header: "Customer Phone", key: "customer_phone_no", width: 20 },
            { header: "Created At", key: "createdAt", width: 20 },
            { header: "Updated At", key: "updatedAt", width: 20 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "4472C4" }
        };

        // Add data rows
        // Add data rows
        for (let index = 0; index < cars.length; index++) {
            const car = cars[index];

            const row = worksheet.addRow({
                car_index_id: car.car_index_id || "",
                name: car.name || "",
                description: car.description || "",
                car_company: car.car_company || "",
                real_price_bwp: car.real_price_bwp || 0,
                actual_price_bwp: car.actual_price_bwp || 0,
                real_price_zmw: car.real_price_zmw || 0,
                actual_price_zmw: car.actual_price_zmw || 0,
                main_image: "", // We'll embed the actual image here
                // all_images: car.images ? car.images.map((img) => img.image_url).join(", ") : "",
                website_state: car.website_state ? "Yes" : "No",
                status: car.status || "",
                year: car.details?.year || "",
                engine_type: car.details?.engine_type || "",
                engine_size: car.details?.engine_size || "",
                transmission: car.details?.transmission || "",
                color: car.details?.color || "",
                fuel: car.details?.fuel || "",
                mileage: car.details?.mileage || "",
                drive: car.details?.drive || "",
                option: car.details?.option || "",
                location: car.details?.location || "",
                condition: car.details?.condition || "",
                duty: car.details?.duty || "",
                stock_no: car.details?.stock_no || "",
                tp: car.moreInfo?.Tp || "",
                cost: car.moreInfo?.cost || "",
                duty_cost: car.moreInfo?.duty || "",
                t_cost: car.moreInfo?.t_cost || "",
                exr: car.moreInfo?.exr || "",
                k_price: car.moreInfo?.k_price || "",
                sold_price: car.moreInfo?.sold_price || "",
                discount: car.moreInfo?.discount || "",
                profit: car.moreInfo?.profit || "",
                comm: car.moreInfo?.comm || "",
                net_profit: car.moreInfo?.net_profit || "",
                sold_date: car.moreInfo?.sold_date
                    ? new Date(car.moreInfo.sold_date).toLocaleDateString()
                    : "",
                sold_by: car.moreInfo?.sold_by || "",
                customer_name: car.moreInfo?.customer_name || "",
                customer_address: car.moreInfo?.customer_address || "",
                customer_phone_no: car.moreInfo?.customer_phone_no || "",
                createdAt: car.createdAt ? new Date(car.createdAt).toLocaleDateString() : "",
                updatedAt: car.updatedAt ? new Date(car.updatedAt).toLocaleDateString() : ""
            });

            // Embed main image if available
            // console.log(car.all_images);
            if (car.main_image) {
                try {
                    // console.log(car.main_image)
                    const response = await fetch(car.main_image);
                    if (!response.ok) throw new Error("Image fetch failed");

                    const imageBuffer = await response.arrayBuffer();
                    const ext = car.main_image.split(".").pop().split("?")[0];

                    const imageId = workbook.addImage({
                        buffer: Buffer.from(imageBuffer),
                        extension: ext
                    });

                    worksheet.addImage(imageId, {
                        tl: { col: 8, row: row.number - 1 },
                        ext: { width: 120, height: 80 }
                    });

                    worksheet.getRow(row.number).height = 80;
                } catch (err) {
                    console.warn(`Failed to embed image for car ${car.car_index_id}:`, err.message);
                }
            }
            // console.log(car.images,'fowiehfho')
            // Optional: Alternate row color
            if (index % 2 === 0) {
                row.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F2F2F2" }
                };
            }
        }

        // Auto-filter for all columns
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: worksheet.columnCount }
        };

        // Freeze the header row
        worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

        // Set response headers for Excel file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=cars-inventory-${Date.now()}.xlsx`
        );

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating Excel file:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating Excel file",
            error: error.message
        });
    }
});

// Alternative version with image hyperlinks (if you want clickable links)
export const exportCarsToExcelWithHyperlinks = asyncHandler(async (req, res) => {
    try {
        const cars = await Car.aggregate([
            {
                $match: {
                    website_state: true,
                    status: "unsold"
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: "cardetails",
                    localField: "_id",
                    foreignField: "car_id",
                    as: "details"
                }
            },
            {
                $lookup: {
                    from: "carimages",
                    localField: "_id",
                    foreignField: "car_id",
                    as: "images"
                }
            },
            {
                $unwind: {
                    path: "$details",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Cars with Image Links");

        // Simplified columns for hyperlink version
        worksheet.columns = [
            { header: "Car ID", key: "car_index_id", width: 15 },
            { header: "Name", key: "name", width: 25 },
            { header: "Company", key: "car_company", width: 20 },
            { header: "Price (BWP)", key: "actual_price_bwp", width: 15 },
            { header: "Price (ZMW)", key: "actual_price_zmw", width: 15 },
            { header: "Main Image", key: "main_image", width: 50 },
            { header: "All Images", key: "all_images", width: 100 },
            { header: "Year", key: "year", width: 10 },
            { header: "Color", key: "color", width: 15 },
            { header: "Status", key: "status", width: 12 }
        ];

        // Style header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "DDEBF7" }
        };

        cars.forEach((car, index) => {
            const row = worksheet.addRow({
                car_index_id: car.car_index_id,
                name: car.name,
                car_company: car.car_company,
                actual_price_bwp: car.actual_price_bwp,
                actual_price_zmw: car.actual_price_zmw,
                main_image: car.main_image,
                all_images: car.images ? car.images.map((img) => img.image_url).join("\n") : "",
                year: car.details?.year || "",
                color: car.details?.color || "",
                status: car.status
            });

            // Add hyperlinks to image URLs
            if (car.main_image) {
                const mainImageCell = row.getCell(6);
                mainImageCell.value = { text: "View Main Image", hyperlink: car.main_image };
                mainImageCell.font = { color: { argb: "0000FF" }, underline: true };
            }

            if (car.images && car.images.length > 0) {
                const allImagesCell = row.getCell(7);
                allImagesCell.value = car.images.map((img, idx) => `Image ${idx + 1}`).join("\n");

                // Note: ExcelJS doesn't support multiple hyperlinks in one cell easily
                // This adds the links as text that users can copy
            }
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=cars-with-images-${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating Excel file:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating Excel file",
            error: error.message
        });
    }
});

// // Add import at the top
// import { createNotification } from "../../utils/notificationHelper.js";

// // Inside createOrUpdateCar function, after successful operations:
// // Add after session.commitTransaction() in the try block:

// // Create notification for car creation/update
// const notificationType = car_id ? "car_updated" : "car_created";
// const notificationTitle = car_id ? "Car Updated" : "New Car Added";
// const notificationMessage = car_id
//     ? `Car "${name}" has been updated by ${req.user.name}`
//     : `New car "${name}" has been added by ${req.user.name}`;

// await createNotification({
//     title: notificationTitle,
//     message: notificationMessage,
//     type: notificationType,
//     related_model: "Car",
//     related_id: car._id,
//     recipient: req.user._id, // Or send to admin users if needed
//     priority: "medium"
// });

// // You can also add notification for car status changes
// if (status === "sold") {
//     await createNotification({
//         title: "Car Sold",
//         message: `Car "${name}" has been marked as sold by ${req.user.name}`,
//         type: "car_sold",
//         related_model: "Car",
//         related_id: car._id,
//         recipient: req.user._id,
//         priority: "high"
//     });
// }
