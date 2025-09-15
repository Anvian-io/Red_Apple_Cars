"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="relative mb-12 w-full">
      {/* Section header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
      </div>

      {/* Carousel skeleton */}
      <div className="overflow-hidden">
        <div className="flex gap-3">
          {Array.from({ length: cardsToShow }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              style={{ width: `calc(${100 / cardsToShow}% - 12px)` }}
            >
              {/* Image skeleton */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              
              {/* Content skeleton */}
              <div className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
            className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

// CarCard component for displaying individual cars
const CarCard = ({ car }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {car.tag}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-heading">{car.name}</h3>
        <p className="text-muted-foreground mt-1">{car.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="text-xl font-bold text-red-600">{car.price}</div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
            Rent Now
          </button>
        </div>
      </div>
    </div>
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

  // Show skeleton for 5 seconds minimum
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
      if (width < 640) setCardsToShow(1);
      else if (width < 1024) setCardsToShow(2);
      else if (width < 1280) setCardsToShow(3);
      else setCardsToShow(4);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Calculate card width including gap
  useEffect(() => {
    if (containerRef.current && !loading && !showSkeleton) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 12; // 0.75rem = 12px
      const calculatedWidth = (containerWidth - (gap * (cardsToShow - 1))) / cardsToShow;
      setCardWidth(calculatedWidth);
    }
  }, [cardsToShow, loading, showSkeleton]);

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

  // Show skeleton while loading or during initial 5 seconds
  if (loading || showSkeleton) {
    return <PremiumCarsSliderSkeleton />;
  }

  const maxIndex = Math.max(0, cars.length - cardsToShow);
  const gap = 12; // 0.75rem = 12px

  return (
    <div
      className="relative mb-12 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-heading">Premium Collection</h2>
        <p className="text-muted-foreground mt-2">Discover our exclusive range of luxury vehicles</p>
      </div>

      {/* Carousel Viewport */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-3"
          animate={{ x: -currentIndex * (cardWidth + gap) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: `${cars.length * (cardWidth + gap)}px` }}
        >
          {cars.map((car) => (
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

      {/* Navigation Arrows (outside overflow-hidden) - Hidden on Mobile */}
      {!isMobile && cars.length > cardsToShow && (
        <>
          <button
            onClick={handlePrev}
            className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 
                       rounded-full shadow-lg hover:bg-gray-100 z-20 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 
                       rounded-full shadow-lg hover:bg-gray-100 z-20 transition-opacity"
          >
            <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-800" />
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
                  ? "bg-red-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}