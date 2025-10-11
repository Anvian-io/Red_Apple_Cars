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
            type: action
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
    const website_state = req.query.website_state;
    const skip = (page - 1) * limit;
    const brand = req.query.brand;
    const name = req.query.name;

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
    if (website_state !== undefined && website_state !== "") {
        if (typeof website_state === "boolean") {
            filter.website_state = website_state;
        } else if (website_state === "true" || website_state === "false") {
            filter.website_state = website_state === "true";
        }
    }
    if (brand) {
        filter.car_company = { $regex: brand, $options: "i" };
    }
    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }

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
    const search = req.query.search || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;
    const brand = req.query.brand;
    const name = req.query.name;

    // Build filter - website_state is always true for Zambia cars
    const filter = { website_state: true };
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { car_company: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }
    if (status) filter.status = status;
    if (brand) {
        filter.car_company = { $regex: brand, $options: "i" };
    }
    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }

    // Get cars with aggregation pipeline (same as getAllCars)
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

    // Format with Zambia currency (ZMW)
    const formattedCars = cars.map((car) => ({
        ...car,
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
    const search = req.query.search || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;
    const brand = req.query.brand;
    const name = req.query.name;

    // Build filter - website_state is always true for Botswana cars
    const filter = { website_state: true };
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { car_company: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }
    if (status) filter.status = status;
    if (brand) {
        filter.car_company = { $regex: brand, $options: "i" };
    }
    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }

    // Get cars with aggregation pipeline (same as getAllCars)
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

    // Format with Botswana currency (BWP)
    const formattedCars = cars.map((car) => ({
        ...car,
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
        // Function to strip HTML tags
        const stripHtmlTags = (html) => {
            if (!html) return "";
            return html.replace(/<[^>]*>/g, "");
        };

        // Function to decode HTML entities
        const decodeHtmlEntities = (text) => {
            if (!text) return "";
            return text
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, " ");
        };

        // Extract filter parameters from request
        const search = req.query.search || "";
        const status = req.query.status || "";
        const website_state = req.query.website_state;
        const brand = req.query.brand;
        const name = req.query.name;

        // Build filter (same logic as getAllCars)
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { car_company: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (status) filter.status = status;

        // Handle website_state filter - it can be boolean or string "true"/"false"
        if (website_state !== undefined && website_state !== "") {
            if (typeof website_state === "boolean") {
                filter.website_state = website_state;
            } else if (website_state === "true" || website_state === "false") {
                filter.website_state = website_state === "true";
            }
        }

        if (brand) {
            filter.car_company = { $regex: brand, $options: "i" };
        }

        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }

        console.log("Excel Export Filter:", filter);

        // Fetch all cars with their related data USING THE FILTER
        const cars = await Car.aggregate([
            { $match: filter },
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

        // If no cars found with filters, return appropriate message
        if (cars.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No cars found matching the specified filters"
            });
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Cars Inventory");

        // Prepare filter information for display
        const appliedFilters = [];
        if (search) appliedFilters.push({ name: "Search", value: search });
        if (status) appliedFilters.push({ name: "Status", value: status });
        if (website_state !== undefined && website_state !== "") {
            appliedFilters.push({
                name: "Website State",
                value:
                    typeof website_state === "boolean"
                        ? website_state
                            ? "Active"
                            : "Inactive"
                        : website_state === "true"
                        ? "Active"
                        : "Inactive"
            });
        }
        if (brand) appliedFilters.push({ name: "Brand", value: brand });
        if (name) appliedFilters.push({ name: "Name", value: name });

        // If no filters applied, show "All Cars"
        if (appliedFilters.length === 0) {
            appliedFilters.push({ name: "Filters", value: "All Cars" });
        }

        // Add Filters header
        const filtersHeaderRow = worksheet.addRow(["Filters"]);
        worksheet.mergeCells(`A${filtersHeaderRow.number}:B${filtersHeaderRow.number}`);

        // Style Filters header
        filtersHeaderRow.font = {
            bold: true,
            size: 14,
            color: { argb: "FFFFFF" }
        };
        filtersHeaderRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "2F75B5" } // Darker blue for distinction
        };
        filtersHeaderRow.alignment = {
            vertical: "middle",
            horizontal: "center"
        };
        filtersHeaderRow.height = 25;

        // Add filter rows
        appliedFilters.forEach((filter) => {
            const filterRow = worksheet.addRow([filter.name, filter.value]);

            // Style filter name cell
            worksheet.getCell(`A${filterRow.number}`).font = {
                bold: true,
                color: { argb: "2F75B5" }
            };
            worksheet.getCell(`A${filterRow.number}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "DDEBF7" } // Light blue background
            };
            worksheet.getCell(`A${filterRow.number}`).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };

            // Style filter value cell
            worksheet.getCell(`B${filterRow.number}`).font = {
                color: { argb: "000000" }
            };
            worksheet.getCell(`B${filterRow.number}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F2F2F2" } // Light gray background
            };
            worksheet.getCell(`B${filterRow.number}`).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        // Add empty row for spacing
        worksheet.addRow([]);

        // Define columns without headers (we'll add the header row manually)
        worksheet.columns = [
            { key: "car_index_id", width: 15 },
            { key: "name", width: 25 },
            { key: "description", width: 50 },
            { key: "car_company", width: 20 },
            { key: "real_price_bwp", width: 18 },
            { key: "actual_price_bwp", width: 18 },
            { key: "real_price_zmw", width: 18 },
            { key: "actual_price_zmw", width: 18 },
            { key: "main_image", width: 50 },
            { key: "website_state", width: 15 },
            { key: "status", width: 12 },
            { key: "year", width: 10 },
            { key: "engine_type", width: 15 },
            { key: "engine_size", width: 15 },
            { key: "transmission", width: 15 },
            { key: "color", width: 15 },
            { key: "fuel", width: 12 },
            { key: "mileage", width: 15 },
            { key: "drive", width: 12 },
            { key: "option", width: 20 },
            { key: "location", width: 20 },
            { key: "condition", width: 15 },
            { key: "duty", width: 15 },
            { key: "stock_no", width: 15 },
            { key: "tp", width: 12 },
            { key: "cost", width: 12 },
            { key: "duty_cost", width: 15 },
            { key: "total_cost", width: 15 },
            { key: "exchange_rate", width: 15 },
            { key: "k_price", width: 15 },
            { key: "sold_price", width: 15 },
            { key: "discount", width: 12 },
            { key: "profit", width: 12 },
            { key: "commission", width: 12 },
            { key: "net_profit", width: 15 },
            { key: "sold_date", width: 15 },
            { key: "sold_by", width: 20 },
            { key: "customer_name", width: 25 },
            { key: "customer_address", width: 30 },
            { key: "customer_phone", width: 20 },
            { key: "createdAt", width: 20 },
            { key: "updatedAt", width: 20 }
        ];

        // Define column headers separately
        const columnHeaders = [
            "Car Index ID",
            "Name",
            "Description",
            "Company",
            "Real Price (BWP)",
            "Actual Price (BWP)",
            "Real Price (ZMW)",
            "Actual Price (ZMW)",
            "Main Image",
            "Website State",
            "Status",
            "Year",
            "Engine Type",
            "Engine Size",
            "Transmission",
            "Color",
            "Fuel",
            "Mileage",
            "Drive",
            "Option",
            "Location",
            "Condition",
            "Duty",
            "Stock No",
            "TP",
            "Cost",
            "Duty Cost",
            "Total Cost",
            "Exchange Rate",
            "K Price",
            "Sold Price",
            "Discount",
            "Profit",
            "Commission",
            "Net Profit",
            "Sold Date",
            "Sold By",
            "Customer Name",
            "Customer Address",
            "Customer Phone",
            "Created At",
            "Updated At"
        ];

        // Add the header row for cars data manually
        const carsHeaderRow = worksheet.addRow(columnHeaders);

        // Style the cars header row
        carsHeaderRow.font = {
            bold: true,
            color: { argb: "FFFFFF" }
        };
        carsHeaderRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "4472C4" }
        };

        // Add data rows
        for (let index = 0; index < cars.length; index++) {
            const car = cars[index];

            // Process description to remove HTML tags and decode entities
            let cleanDescription = "";
            if (car.description) {
                cleanDescription = decodeHtmlEntities(stripHtmlTags(car.description));
                cleanDescription = cleanDescription.replace(/\s+/g, " ").trim();
            }

            const row = worksheet.addRow({
                car_index_id: car.car_index_id || "",
                name: car.name || "",
                description: cleanDescription,
                car_company: car.car_company || "",
                real_price_bwp: car.real_price_bwp || 0,
                actual_price_bwp: car.actual_price_bwp || 0,
                real_price_zmw: car.real_price_zmw || 0,
                actual_price_zmw: car.actual_price_zmw || 0,
                main_image: car.main_image || "",
                website_state: car.website_state ? "Yes" : "No",
                status: car.status || "",
                year: car.details?.[0]?.year || "",
                engine_type: car.details?.[0]?.engine_type || "",
                engine_size: car.details?.[0]?.engine_size || "",
                transmission: car.details?.[0]?.transmission || "",
                color: car.details?.[0]?.color || "",
                fuel: car.details?.[0]?.fuel || "",
                mileage: car.details?.[0]?.mileage || "",
                drive: car.details?.[0]?.drive || "",
                option: car.details?.[0]?.option || "",
                location: car.details?.[0]?.location || "",
                condition: car.details?.[0]?.condition || "",
                duty: car.details?.[0]?.duty || "",
                stock_no: car.details?.[0]?.stock_no || "",
                tp: car.moreInfo?.[0]?.Tp || "",
                cost: car.moreInfo?.[0]?.cost || "",
                duty_cost: car.moreInfo?.[0]?.duty || "",
                total_cost: car.moreInfo?.[0]?.t_cost || "",
                exchange_rate: car.moreInfo?.[0]?.exr || "",
                k_price: car.moreInfo?.[0]?.k_price || "",
                sold_price: car.moreInfo?.[0]?.sold_price || "",
                discount: car.moreInfo?.[0]?.discount || "",
                profit: car.moreInfo?.[0]?.profit || "",
                commission: car.moreInfo?.[0]?.comm || "",
                net_profit: car.moreInfo?.[0]?.net_profit || "",
                sold_date: car.moreInfo?.[0]?.sold_date
                    ? new Date(car.moreInfo[0].sold_date).toLocaleDateString()
                    : "",
                sold_by: car.moreInfo?.[0]?.sold_by || "",
                customer_name: car.moreInfo?.[0]?.customer_name || "",
                customer_address: car.moreInfo?.[0]?.customer_address || "",
                customer_phone: car.moreInfo?.[0]?.customer_phone_no || "",
                createdAt: car.createdAt ? new Date(car.createdAt).toLocaleDateString() : "",
                updatedAt: car.updatedAt ? new Date(car.updatedAt).toLocaleDateString() : ""
            });

            // Set description cell to wrap text for better readability
            const descriptionCell = `C${row.number}`;
            worksheet.getCell(descriptionCell).alignment = { wrapText: true };

            // Embed main image if available
            if (car.main_image) {
                try {
                    const response = await fetch(car.main_image);
                    if (!response.ok) throw new Error("Image fetch failed");

                    const imageBuffer = await response.arrayBuffer();
                    const ext = car.main_image.split(".").pop().split("?")[0];

                    const imageId = workbook.addImage({
                        buffer: Buffer.from(imageBuffer),
                        extension: ext
                    });

                    // Adjust row number for image placement (accounting for filter rows)
                    worksheet.addImage(imageId, {
                        tl: { col: 8, row: row.number - 1 },
                        ext: { width: 120, height: 80 }
                    });

                    worksheet.getRow(row.number).height = 80;
                } catch (err) {
                    console.warn(`Failed to embed image for car ${car.car_index_id}:`, err.message);
                }
            }

            // Alternate row color
            if (index % 2 === 0) {
                row.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F2F2F2" }
                };
            }
        }

        // Calculate the cars header row number (after filters + spacing)
        const carsHeaderRowNumber = appliedFilters.length + 3; // +1 for filters header, +1 for empty row

        // Auto-filter for all columns (starting from cars header row)
        worksheet.autoFilter = {
            from: { row: carsHeaderRowNumber, column: 1 },
            to: { row: carsHeaderRowNumber, column: worksheet.columnCount }
        };

        // Freeze the cars header row and filter section
        worksheet.views = [
            {
                state: "frozen",
                xSplit: 0,
                ySplit: carsHeaderRowNumber // Freeze at cars header row
            }
        ];

        // Set response headers for Excel file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // Create filename with timestamp and filters info
        const timestamp = new Date().toISOString().split("T")[0];
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=cars-inventory-${timestamp}.xlsx`
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
