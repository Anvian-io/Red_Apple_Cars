"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";

export default function PremiumCarsSlider({ cars }) {
  const [cardsToShow, setCardsToShow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else if (window.innerWidth < 1280) setCardsToShow(3);
      else setCardsToShow(4);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Calculate card width including gap
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 12; // 0.75rem = 12px
      const calculatedWidth = (containerWidth - (gap * (cardsToShow - 1))) / cardsToShow;
      setCardWidth(calculatedWidth);
    }
  }, [cardsToShow]);

  // Auto-play
  useEffect(() => {
    if (isHovered || cars.length <= cardsToShow) return;
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [isHovered, cars.length, cardsToShow, currentIndex]);

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

  const maxIndex = Math.max(0, cars.length - cardsToShow);
  const gap = 12; // 0.75rem = 12px

  return (
    <div
  className="relative mb-12 w-full"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  ref={containerRef}
>
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

  {/* Navigation Arrows (outside overflow-hidden) */}
  {cars.length > cardsToShow && (
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