"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";

export default function DriveTypeSlider({ allCars, driveTypes }) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeDriveType, setActiveDriveType] = useState("All");
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [yearRange, setYearRange] = useState([2010, 2024]);
  const [cardWidth, setCardWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Simulate loading for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Filter cars
  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const driveTypeMatch =
        activeDriveType === "All" || car.driveType === activeDriveType;

      const searchMatch =
        searchTerm === "" ||
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (car.driveType && car.driveType.toLowerCase().includes(searchTerm.toLowerCase()));

      const priceMatch = car.numericPrice >= priceRange[0] && car.numericPrice <= priceRange[1];

      const yearMatch = car.year >= yearRange[0] && car.year <= yearRange[1];

      return driveTypeMatch && searchMatch && priceMatch && yearMatch;
    });
  }, [allCars, activeDriveType, searchTerm, priceRange, yearRange]);

  // Responsive cards count
  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) setCardsToShow(1);
      else if (width < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Card width calc
  useEffect(() => {
    if (containerRef.current && filteredCars.length > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 24;
      const calculatedWidth = ((containerWidth - gap * (cardsToShow - 1)) / cardsToShow) * 0.9;
      setCardWidth(calculatedWidth);
    }
  }, [cardsToShow, filteredCars]);

  // Reset on filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredCars]);

  const handleNext = () => {
    if (currentIndex < filteredCars.length - cardsToShow) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const maxIndex = Math.max(0, filteredCars.length - cardsToShow);
  const gap = 24;

  // Skeleton component
  const SkeletonLoader = () => {
    return (
      <div className="mt-16">
        {/* Title skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded-full w-1/3 mx-auto"></div>
        </div>

        {/* Drive Type Filter Buttons skeleton */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8 px-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-gray-200 rounded-full w-20 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Carousel skeleton */}
        <div className="relative px-4" ref={containerRef}>
          <div className="overflow-hidden">
            <div className="flex gap-6">
              {Array.from({ length: cardsToShow }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white rounded-xl shadow-md p-4"
                  style={{ width: `${cardWidth || 300}px` }}
                >
                  <div className="h-40 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 md:w-3 md:h-3 bg-gray-200 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="mt-16">
          <h3 className="text-center text-xl md:text-2xl font-bold text-heading mb-8">
            Explore by Drive Type
          </h3>

          {/* Drive Type Filter Buttons */}
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8 px-4">
            {["All", ...driveTypes].map((type, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDriveType(type)}
                className={`px-4 py-2 text-sm md:text-base rounded-full transition-colors ${
                  activeDriveType === type
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          {/* Carousel */}
          <div
            className="relative px-4"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {filteredCars.length > 0 ? (
              <>
                <div className="overflow-hidden">
                  <motion.div
                    className="flex gap-6"
                    animate={{ x: -currentIndex * (cardWidth + gap) }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      width: `${
                        filteredCars.length * cardWidth +
                        (filteredCars.length - 1) * gap
                      }px`,
                    }}
                  >
                    {filteredCars.map((car) => (
                      <div
                        key={car.id}
                        className="flex-shrink-0"
                        style={{ width: `${cardWidth}px` }}
                      >
                        <CarCard car={car} />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Arrows */}
                {!isMobile && filteredCars.length > cardsToShow && (
                  <>
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={`absolute -left-6 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 z-10 transition-opacity ${
                        currentIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-100"
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={currentIndex >= maxIndex}
                      className={`absolute -right-6 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 z-10 transition-opacity ${
                        currentIndex >= maxIndex
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-100"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Dots */}
                {filteredCars.length > cardsToShow && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                          index === currentIndex
                            ? "bg-red-600 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">
                  No cars match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}