"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Fuel, Users, Calendar, Car, Heart, Zap } from "lucide-react";

// Skeleton component for loading state
const PremiumCarsSliderSkeleton = () => {
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsToShow(1);
      else if (width < 1024) setCardsToShow(2);
      else if (width < 1280) setCardsToShow(3);
      else setCardsToShow(4);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  return (
    <div className="relative mb-12 w-full px-4">
      {/* Section header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mx-auto mb-2"></div>
      </div>

      {/* Carousel skeleton */}
      <div className="overflow-hidden">
        <div className="flex gap-4 md:gap-6">
          {Array.from({ length: cardsToShow }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white dark:bg-card-bg rounded-xl shadow-md overflow-hidden"
              style={{ width: `calc(${100 / cardsToShow}% - 16px)` }}
            >
              {/* Image skeleton */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              
              {/* Content skeleton */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-3"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-3"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 md:w-3 md:h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

// Premium CarCard component - Resized to match DriveTypeSlider
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
            className={isLiked ? "text-red-500 fill-current" : "text-gray-600"} 
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
          <h3 className="font-bold text-lg text-card-text truncate">{car.name}</h3>
          <div className="flex items-center text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs ml-1 text-gray-600 dark:text-gray-300">{car.rating}</span>
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
            <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
            <span className="font-bold text-lg text-primary">{car.price}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 dark:text-gray-400">Mileage</span>
            <span className="font-semibold text-sm">{car.mileage}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-primary hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
            View Details
          </button>
          <button className="border border-primary text-primary hover:bg-red-50 py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
            Save Car
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function PremiumCarsSlider({ cars, loading = false }) {
  const [cardsToShow, setCardsToShow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Show skeleton for 3 seconds minimum
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) setCardsToShow(1);       // Mobile → 1 big card
else if (width < 1024) setCardsToShow(1); // Tablet → 1 big card
else if (width < 1280) setCardsToShow(2); // Small laptop → 2 cards
else setCardsToShow(3);      
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Calculate card width including gap
  useEffect(() => {
    if (containerRef.current && !loading && !showSkeleton) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = isMobile ? 16 : 24;
      const calculatedWidth = (containerWidth - gap * (cardsToShow - 1)) / cardsToShow;

      setCardWidth(calculatedWidth);
    }
  }, [cardsToShow, loading, showSkeleton, isMobile]);

  // Auto-play
  useEffect(() => {
    if (isHovered || cars.length <= cardsToShow || loading || showSkeleton) return;
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [isHovered, cars.length, cardsToShow, currentIndex, loading, showSkeleton]);

  const handleNext = () => {
    if (currentIndex < cars.length - cardsToShow) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back to start if at end
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Loop to end if at start
      setCurrentIndex(cars.length - cardsToShow);
    }
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || loading || showSkeleton) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

    if (distance > minSwipeDistance) {
      // Swipe left - go to next slide
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - go to previous slide
      handlePrev();
    }
    
    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Show skeleton while loading or during initial 3 seconds
  if (loading || showSkeleton) {
    return <PremiumCarsSliderSkeleton />;
  }

  const maxIndex = Math.max(0, cars.length - cardsToShow);
  const gap = isMobile ? 16 : 24;

  return (
    <section className="mt-16 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-heading">Premium Collection</h3>
        <p className="text-lg text-muted-foreground mt-2">
          Discover our exclusive selection of luxury vehicles
        </p>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Viewport */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{ x: -currentIndex * (cardWidth + gap) }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: `${
                cars.length * cardWidth +
                (cars.length - 1) * gap
              }px`,
            }}
          >
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex-shrink-0"
                style={{ width: `${cardWidth}px` }}
              >
                <PremiumCarCard car={car} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows - Hidden on Mobile */}
        {!isMobile && cars.length > cardsToShow && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute -left-12 top-1/2 -translate-y-1/2 bg-primary text-text dark:bg-card-bg p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 z-10 transition-all ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-text" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`absolute -right-12 top-1/2 -translate-y-1/2 bg-primary text-text dark:bg-card-bg p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 z-10 transition-all   ${
                currentIndex >= maxIndex
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 " />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {cars.length > cardsToShow && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}