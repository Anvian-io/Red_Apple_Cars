// controllers/dashboardController.js
import Car from "../../models/Car.js";
import CarMoreInfo from "../../models/CarMoreInfo.js";
import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";

// Get Dashboard Data
export const getDashboardData = asyncHandler(async (req, res) => {
    const { country, timeRange = "6m" } = req.query;

    // Validate country parameter
    if (!country || (country !== "botswana" && country !== "zambia")) {
        return sendResponse(
            res,
            false,
            null,
            "Country parameter is required and must be 'botswana' or 'zambia'",
            statusType.BAD_REQUEST
        );
    }

    try {
        // Calculate date range based on timeRange
        const dateRange = calculateDateRange(timeRange);
        const startDate = dateRange.startDate;
        const endDate = dateRange.endDate;

        // Get sales data (sold cars)
        const salesData = await getSalesData(country, startDate, endDate);

        // Get financial data (expenses and profit)
        const financialData = await getFinancialData(country, startDate, endDate);

        // Get dashboard statistics
        const statistics = await getDashboardStatistics(country);

        return sendResponse(
            res,
            true,
            {
                salesData,
                financialData,
                statistics,
                timeRange,
                country,
                period: dateRange.period
            },
            "Dashboard data fetched successfully",
            statusType.SUCCESS
        );
    } catch (error) {
        console.error("Dashboard data error:", error);
        throw error;
    }
});

// Calculate date range based on time range parameter
const calculateDateRange = (timeRange) => {
    const endDate = new Date();
    let startDate = new Date();
    let period = [];

    switch (timeRange) {
        case "7d":
            startDate.setDate(startDate.getDate() - 7);
            period = getLastNDays(7);
            break;
        case "30d":
            startDate.setDate(startDate.getDate() - 30);
            period = getLastNMonths(1);
            break;
        case "90d":
            startDate.setDate(startDate.getDate() - 90);
            period = getLastNMonths(3);
            break;
        case "6m":
        default:
            startDate.setMonth(startDate.getMonth() - 6);
            period = getLastNMonths(6);
            break;
    }

    return { startDate, endDate, period };
};

// Get last N days as array
const getLastNDays = (days) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        result.push(date.toLocaleDateString("default", { day: "numeric", month: "short" }));
    }
    return result;
};

// Get last N months as array
const getLastNMonths = (months) => {
    const result = [];
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        result.push(date.toLocaleDateString("default", { month: "short" }));
    }
    return result;
};

// Get sales data for dashboard
const getSalesData = async (country, startDate, endDate) => {
    const matchStage = {
        status: "sold",
        createdAt: { $gte: startDate, $lte: endDate }
    };

    // Add country-specific pricing field
    const priceField = country === "botswana" ? "real_price_bwp" : "real_price_zmw";

    const salesAggregation = await Car.aggregate([
        {
            $match: matchStage
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
            $unwind: {
                path: "$moreInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$moreInfo.sold_date" },
                    month: { $month: "$moreInfo.sold_date" }
                },
                totalSales: { $sum: `$${priceField}` },
                carCount: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    // Format the data for charts
    return formatSalesData(salesAggregation, country);
};

// Format sales data for charts
const formatSalesData = (salesAggregation, country) => {
    const months = getLastNMonths(6);

    // Create a map for easy lookup
    const salesMap = new Map();
    salesAggregation.forEach((item) => {
        const monthKey = new Date(item._id.year, item._id.month - 1).toLocaleString("default", {
            month: "short"
        });
        salesMap.set(monthKey, {
            sales: item.totalSales,
            count: item.carCount
        });
    });

    // Format data for chart
    return months.map((month) => {
        const monthData = salesMap.get(month) || { sales: 0, count: 0 };

        if (country === "botswana") {
            return {
                month,
                botswana: monthData.sales,
                botswanaCount: monthData.count
            };
        } else {
            return {
                month,
                zambia: monthData.sales,
                zambiaCount: monthData.count
            };
        }
    });
};

// Get financial data (expenses and profit)
const getFinancialData = async (country, startDate, endDate) => {
    const matchStage = {
        status: "sold",
        createdAt: { $gte: startDate, $lte: endDate }
    };

    const financialAggregation = await Car.aggregate([
        {
            $match: matchStage
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
            $unwind: {
                path: "$moreInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$moreInfo.sold_date" },
                    month: { $month: "$moreInfo.sold_date" }
                },
                totalExpenses: { $sum: "$moreInfo.cost" },
                totalProfit: { $sum: "$moreInfo.profit" },
                totalDuty: { $sum: "$moreInfo.duty" },
                carCount: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    return formatFinancialData(financialAggregation, country);
};

// Format financial data for charts
const formatFinancialData = (financialAggregation, country) => {
    const months = getLastNMonths(6);

    const financialMap = new Map();
    financialAggregation.forEach((item) => {
        const monthKey = new Date(item._id.year, item._id.month - 1).toLocaleString("default", {
            month: "short"
        });
        financialMap.set(monthKey, {
            expenses: item.totalExpenses,
            profit: item.totalProfit,
            duty: item.totalDuty,
            count: item.carCount
        });
    });

    return months.map((month) => {
        const monthData = financialMap.get(month) || { expenses: 0, profit: 0, duty: 0, count: 0 };

        if (country === "botswana") {
            return {
                month,
                botswanaExpenses: monthData.expenses,
                botswanaProfit: monthData.profit,
                botswanaDuty: monthData.duty,
                botswanaCount: monthData.count
            };
        } else {
            return {
                month,
                zambiaExpenses: monthData.expenses,
                zambiaProfit: monthData.profit,
                zambiaDuty: monthData.duty,
                zambiaCount: monthData.count
            };
        }
    });
};

// Get dashboard statistics
const getDashboardStatistics = async (country) => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Total sold cars
    const totalSold = await Car.countDocuments({ status: "sold" });

    // Monthly sales
    const monthlySales = await Car.aggregate([
        {
            $match: {
                status: "sold",
                createdAt: { $gte: startOfMonth }
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
            $unwind: {
                path: "$moreInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: country === "botswana" ? "$real_price_bwp" : "$real_price_zmw"
                },
                totalProfit: { $sum: "$moreInfo.profit" },
                carCount: { $sum: 1 }
            }
        }
    ]);

    // Yearly sales
    const yearlySales = await Car.aggregate([
        {
            $match: {
                status: "sold",
                createdAt: { $gte: startOfYear }
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
            $unwind: {
                path: "$moreInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: country === "botswana" ? "$real_price_bwp" : "$real_price_zmw"
                },
                totalProfit: { $sum: "$moreInfo.profit" },
                carCount: { $sum: 1 }
            }
        }
    ]);

    // Available cars (unsold)
    const availableCars = await Car.countDocuments({
        status: "unsold",
        website_state: true
    });

    const monthlyData = monthlySales[0] || { totalRevenue: 0, totalProfit: 0, carCount: 0 };
    const yearlyData = yearlySales[0] || { totalRevenue: 0, totalProfit: 0, carCount: 0 };

    return {
        totalSoldCars: totalSold,
        availableCars,
        monthlyRevenue: monthlyData.totalRevenue,
        monthlyProfit: monthlyData.totalProfit,
        monthlyCarsSold: monthlyData.carCount,
        yearlyRevenue: yearlyData.totalRevenue,
        yearlyProfit: yearlyData.totalProfit,
        yearlyCarsSold: yearlyData.carCount,
        currency: country === "botswana" ? "BWP" : "ZMW"
    };
};

// Get recent sold cars
export const getRecentSoldCars = asyncHandler(async (req, res) => {
    const { country, limit = 10 } = req.query;

    const recentCars = await Car.aggregate([
        {
            $match: { status: "sold" }
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
                from: "cardetails",
                localField: "_id",
                foreignField: "car_id",
                as: "details"
            }
        },
        {
            $unwind: {
                path: "$moreInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$details",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: { "moreInfo.sold_date": -1 }
        },
        {
            $limit: parseInt(limit)
        },
        {
            $project: {
                name: 1,
                car_company: 1,
                real_price_bwp: 1,
                real_price_zmw: 1,
                main_image: 1,
                "moreInfo.sold_date": 1,
                "moreInfo.sold_price": 1,
                "moreInfo.profit": 1,
                "details.year": 1,
                "details.color": 1,
                "details.mileage": 1,
                soldPrice: {
                    $cond: {
                        if: { $eq: [country, "botswana"] },
                        then: "$real_price_bwp",
                        else: "$real_price_zmw"
                    }
                }
            }
        }
    ]);

    return sendResponse(
        res,
        true,
        recentCars,
        "Recent sold cars fetched successfully",
        statusType.SUCCESS
    );
});
