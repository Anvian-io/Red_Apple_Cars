"use client";
import { getAllCars } from "@/services/cars/carServices";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Car, DollarSign, ChevronDown, ChevronUp,Heart,
  Zap, Star,
  Fuel,
  Users,
  Calendar, } from "lucide-react";

const Page = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false); // New state for filter visibility

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setIsLoading(true);
                const response = await getAllCars({});
                console.log("API Response for cars:", response);
                if (response.data && response.data.status) {
                    const mappedCars = response.data.data.cars.map((car) => {
                        const mileageStr = car.details.mileage || "0";
                        const numericMileage = parseFloat(mileageStr);

                        // Function to remove HTML tags from description
                        const stripHtmlTags = (html) => {
                            if (!html) return '';
                            return html.replace(/<[^>]*>/g, '');
                        };

                        return {
                            id: car._id,
                            name: car.name,
                            price: `$${car.real_price_bwp.toLocaleString()}`,
                            numericPrice: car.real_price_bwp,
                            year: car.details.year,
                            mileage: car.details.mileage,
                            numericMileage,
                            fuel: car.details.fuel,
                            seats: 5,
                            driveType: car.details.drive,
                            image: car.main_image,
                            description: stripHtmlTags(car.description), // Clean HTML tags
                            car_company: car.car_company,
                            transmission: car.details.transmission,
                            condition: car.details.condition,
                            location: car.details.location,
                        }
                    });
                    setCars(mappedCars);

                    const prices = mappedCars.map(car => car.numericPrice);
                    const actualMaxPrice = Math.max(...prices);
                    setMaxPrice(actualMaxPrice);
                }
            } catch (error) {
                console.error("error fetching cars: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Memoized filtering logic
    useMemo(() => {
        let updatedCars = [...cars];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            updatedCars = updatedCars.filter((car) =>
                car.name.toLowerCase().includes(query) ||
                car.car_company.toLowerCase().includes(query) ||
                car.description.toLowerCase().includes(query) ||
                car.fuel.toLowerCase().includes(query) ||
                car.transmission.toLowerCase().includes(query)
            );
        }

        updatedCars = updatedCars.filter(
            (car) => car.numericPrice >= minPrice && car.numericPrice <= maxPrice
        );

        setFilteredCars(updatedCars);
    }, [searchQuery, minPrice, maxPrice, cars]);

    const resetFilters = () => {
        setSearchQuery("");
        setMinPrice(0);
        setMaxPrice(Math.max(...cars.map(car => car.numericPrice)));
    };

    const hasActiveFilters = searchQuery || minPrice > 0 || maxPrice < Math.max(...cars.map(car => car.numericPrice));

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
        hover: {
            y: -4,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Car className="w-16 h-16 text-[var(--primary)] mx-auto" />
                    </motion.div>
                    <p className="text-[var(--text)] text-lg font-light">Loading inventory...</p>
                </motion.div>
            </div>
        );
    }
    const PremiumCarCard = ({ car }) => {
        const [isLiked, setIsLiked] = useState(false);

        return (
            <motion.div
                className="bg-card-bg rounded-xl shadow-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                whileHover={{ y: -5 }}
            >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                    <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Premium badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Zap size={10} className="mr-1" fill="currentColor" />
                        PREMIUM
                    </div>

                    {/* Like button */}
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                        <Heart
                            size={14}
                            className={isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}
                        />
                    </button>

                    {/* Tag */}
                    {car.tag && (
                        <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                            {car.tag}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-card-text truncate">
                            {car.name}
                        </h3>
                        <div className="flex items-center text-amber-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs ml-1 text-gray-600 dark:text-gray-300">
                                {car.rating}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center mr-3">
                            <Fuel size={14} className="mr-1" />
                            {car.fuelType}
                        </span>
                        <span className="flex items-center mr-3">
                            <Users size={14} className="mr-1" />
                            {car.seats}
                        </span>
                        <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {car.year}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Price
                            </span>
                            <span className="font-bold text-lg text-primary">{car.price}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Mileage
                            </span>
                            <span className="font-semibold text-sm">{car.mileage}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link href={`/car/${car.id}`}>
                            <button className="bg-primary hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                                View Details
                            </button>
                        </Link>
                        <button className="border border-primary text-primary hover:bg-red-50 py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                            Save Car
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };
    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary-bg)] border-b border-[var(--border)]">
                <div className="container mx-auto px-6 py-12">


                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-6xl mx-auto space-y-6"
                    >
                        {/* Search Bar */}
                        <div className="relative flex items-center max-w-3xl mx-auto bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[var(--primary)]/20 focus-within:border-[var(--primary)] backdrop-blur-sm">
                            {/* Search Icon */}
                            <Search className="absolute left-4 text-[var(--text)]/60 w-5 h-5" />

                            {/* Input */}
                            <input
                                type="text"
                                placeholder="Search by model, brand, transmission, or fuel type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 text-[var(--text)] bg-transparent focus:outline-none placeholder-[var(--text)]/50 text-base"
                            />

                            {/* Clear Button */}
                            {searchQuery && (
                                <motion.button
                                    onClick={() => setSearchQuery("")}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-4 text-[var(--text)]/60 hover:text-[var(--primary)] transition-all"
                                >
                                    ✕
                                </motion.button>
                            )}
                        </div>

                        {/* Filter Toggle Button */}
                        <div className="flex justify-center">
                            <motion.button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </motion.button>
                        </div>

                        {/* Collapsible Price Filter */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 flex flex-col gap-4 shadow-sm">
                                        {/* Header Row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[var(--heading)] font-semibold">
                                                <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                                                Price Range
                                            </div>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={resetFilters}
                                                    className="text-xs text-[var(--primary)] hover:text-[var(--hover-text)] transition-all"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>

                                        {/* Inputs and Range in one line */}
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                                className="w-full sm:w-1/2 p-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                                placeholder="Min"
                                            />
                                            <span className="text-[var(--text)]/60 hidden sm:inline">—</span>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                className="w-full sm:w-1/2 p-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                                placeholder="Max"
                                            />
                                        </div>

                                        {/* Slider */}
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="range"
                                                min="0"
                                                max={Math.max(...cars.map((car) => car.numericPrice))}
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                className="w-full h-1.5 bg-[var(--border)] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-[var(--primary)] 
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
              [&::-webkit-slider-thumb]:shadow-md"
                                            />
                                            <div className="flex justify-between text-xs text-[var(--text)]/60">
                                                <span>${minPrice.toLocaleString()}</span>
                                                <span>${maxPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Results Summary */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between text-sm text-[var(--text)]/70"
                        >
                            <span>
                                Showing <strong className="text-[var(--primary)]">{filteredCars.length}</strong> of {cars.length} vehicles
                            </span>
                            {hasActiveFilters && (
                                <span className="flex items-center gap-1">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters active
                                </span>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="container mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {filteredCars.length > 0 ? (
                        <motion.div
                            key="cars-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                            {filteredCars.map((car) => (
                                <div
                                    key={car._id}
                                    className="flex-shrink-0"
                                    
                                >
                                    <PremiumCarCard car={car} />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-cars"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-20"
                        >
                            <Car className="w-24 h-24 text-[var(--border)] mx-auto mb-6 opacity-50" />
                            <h3 className="text-2xl font-semibold text-[var(--header)] mb-3">
                                No vehicles found
                            </h3>
                            <p className="text-[var(--text)]/70 max-w-md mx-auto mb-8">
                                We couldn't find any vehicles matching your criteria. Try adjusting your search or filters.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="bg-[var(--button-bg)] text-white px-6 py-3 rounded-lg hover:bg-[var(--hover-text)] transition-colors font-medium"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Page;