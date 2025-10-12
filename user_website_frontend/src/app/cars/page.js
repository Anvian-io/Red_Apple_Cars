"use client";
import { getAllCars } from "@/services/cars/carServices";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Car, DollarSign } from "lucide-react";

const Page = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [isLoading, setIsLoading] = useState(true);

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
                            description: car.description,
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

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary-bg)] border-b border-[var(--border)]">
                <div className="container mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--header)] mb-4">
                            Premium Vehicle Collection
                        </h1>
                        <p className="text-lg text-[var(--text)] max-w-2xl mx-auto">
                            Discover your perfect vehicle from our curated selection of premium automobiles
                        </p>
                    </motion.div>

                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-6xl mx-auto space-y-6"
                    >
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text)]/60 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by model, brand, or features..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder-[var(--text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base backdrop-blur-sm"
                            />
                        </div>

                        {/* Price Filter */}
                        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-[var(--primary)]" />
                                    <span className="font-semibold text-[var(--heading)]">Price Range</span>
                                </div>
                                {hasActiveFilters && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={resetFilters}
                                        className="text-sm text-[var(--primary)] hover:text-[var(--hover-text)] transition-colors px-3 py-1 rounded-lg hover:bg-[var(--primary)]/10"
                                    >
                                        Clear filters
                                    </motion.button>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm text-[var(--text)]/70 mb-2 block">Minimum</label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(Number(e.target.value))}
                                            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm text-[var(--text)]/70 mb-2 block">Maximum</label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
                                            placeholder={Math.max(...cars.map(car => car.numericPrice)).toLocaleString()}
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max={Math.max(...cars.map(car => car.numericPrice))}
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full h-1.5 bg-[var(--border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>

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
                                <motion.div
                                    key={car.id}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="group cursor-pointer"
                                >
                                    <div className="bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                                        {/* Image Section - Dominant */}
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <motion.img
                                                src={car.image}
                                                alt={car.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-[var(--primary)] text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                                                    {car.year}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4">
                                                <span className="bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                                                    {car.fuel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section - Compact */}
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-[var(--card-text)] line-clamp-1 mb-1">
                                                    {car.name}
                                                </h3>
                                                <p className="text-[var(--text)]/60 text-sm font-light">
                                                    {car.car_company}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="text-2xl font-bold text-[var(--primary)]">
                                                    {car.price}
                                                </div>
                                                <div className="text-sm text-[var(--text)]/60 bg-[var(--background)] px-3 py-1.5 rounded-full">
                                                    {car.mileage} km
                                                </div>
                                            </div>

                                            <p className="text-[var(--text)]/70 text-sm leading-relaxed line-clamp-2 font-light">
                                                {car.description}
                                            </p>

                                            <div className="pt-2">
                                                <Link
                                                    href={`/car/${car.id}`}
                                                    className="w-full inline-flex items-center justify-center bg-[var(--button-bg)] text-white font-medium py-3 px-6 rounded-lg hover:bg-[var(--hover-text)] transition-all duration-300 group-hover:shadow-lg text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
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