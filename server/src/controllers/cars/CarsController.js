// controllers/carController.js
import Car from "../../models/Car.js";
import CarDetail from "../../models/CarDetails.js";
import CarMoreInfo from "../../models/CarMoreInfo.js";
import CarImage from "../../models/CarImage.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import mongoose from "mongoose";

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
            console.log(req.files,"fweoif")
            if (req.files && req.files.main_image) {
                // Delete old image if exists
                console.log('fjewoife')
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
