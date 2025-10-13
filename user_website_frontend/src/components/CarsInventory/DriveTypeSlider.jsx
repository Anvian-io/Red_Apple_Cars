'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Fuel,
  Users,
  Calendar,
  Car,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

// Enhanced CarCard Component - Resized to match PremiumCarsSlider
const CarCard = ({ car }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="bg-card-bg rounded-xl shadow-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Drive Type Badge */}
        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
          {car.driveType}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <Heart
            size={14}
            className={isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}
          />
        </button>

        {/* Featured Badge */}
        {car.isFeatured && (
          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}
      </div>

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
            {car.fuel}
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
            <span className="font-bold text-lg text-primary">
              ZK {car.numericPrice.toLocaleString()}
            </span>
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
          <button className="border border-primary text-primary hover:bg-red-50 dark:hover:bg-red-950/20 py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
            Save Car
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton component for loading state
const DriveTypeSliderSkeleton = () => {
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsToShow(1);
      else if (width < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };

    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  return (
    <div className="mt-16 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Section header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mx-auto mb-2 animate-pulse"></div>
      </div>

      {/* Filter buttons skeleton */}
      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"
          ></div>
        ))}
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
              <div className="relative h-72 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

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
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 md:w-3 md:h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function DriveTypeSlider({ allCars, driveTypes }) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeDriveType, setActiveDriveType] = useState('All');
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [yearRange, setYearRange] = useState([2010, 2024]);
  const [cardWidth, setCardWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Show skeleton for 3 seconds minimum
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowSkeleton(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Filter cars
  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const driveTypeMatch =
        activeDriveType === 'All' || car.driveType === activeDriveType;

      const searchMatch =
        searchTerm === '' ||
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (car.driveType &&
          car.driveType.toLowerCase().includes(searchTerm.toLowerCase()));

      const priceMatch =
        car.numericPrice >= priceRange[0] && car.numericPrice <= priceRange[1];

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
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  // Card width calc
  useEffect(() => {
    if (
      containerRef.current &&
      filteredCars.length > 0 &&
      !isLoading &&
      !showSkeleton
    ) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = isMobile ? 16 : 24;
      const calculatedWidth =
        (containerWidth - gap * (cardsToShow - 1)) / cardsToShow;
      setCardWidth(calculatedWidth);
    }
  }, [cardsToShow, filteredCars, isMobile, isLoading, showSkeleton]);

  // Reset on filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredCars]);

  const handleNext = () => {
    if (currentIndex < filteredCars.length - cardsToShow) {
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
      setCurrentIndex(filteredCars.length - cardsToShow);
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
    if (!touchStartX.current || !touchEndX.current || isLoading || showSkeleton)
      return;

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

  // Auto-play
  useEffect(() => {
    if (filteredCars.length <= cardsToShow || isLoading || showSkeleton) return;
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [filteredCars.length, cardsToShow, currentIndex, isLoading, showSkeleton]);

  const maxIndex = Math.max(0, filteredCars.length - cardsToShow);
  const gap = isMobile ? 16 : 24;

  // Show skeleton while loading or during initial 3 seconds
  if (isLoading || showSkeleton) {
    return <DriveTypeSliderSkeleton />;
  }

  return (
    <section className="mt-16 px-4 md:px-6 max-w-7xl mx-auto">
      <h3 className="text-center text-2xl md:text-3xl font-bold text-heading mb-8">
        Explore by Drive Type
      </h3>

      {/* Drive Type Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        {['All', ...driveTypes].map((type, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveDriveType(type)}
            className={`px-4 py-2 text-sm md:text-base rounded-full transition-colors ${
              activeDriveType === type
                ? 'bg-primary text-white shadow-md'
                : 'bg-secondary-bg text-card-text hover:bg-hover-bg'
            }`}
          >
            {type}
          </motion.button>
        ))}
      </div>

      {/* Search and Filters for Mobile */}
      {isMobile && (
        <div className="mb-6 bg-secondary-bg p-3 rounded-lg">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-9 rounded-lg border border-border bg-input-bg text-input-text"
            />
            <Car size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-card-text mb-1">
                Price Range
              </label>
              <select
                className="w-full p-2 rounded-lg border border-border bg-input-bg text-input-text text-sm"
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              >
                <option value={15000000}>Any Price</option>
                <option value={10000}>Under ZK 10k</option>
                <option value={20000}>Under ZK 20k</option>
                <option value={30000}>Under ZK 30k</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-text mb-1">
                Year
              </label>
              <select
                className="w-full p-2 rounded-lg border border-border bg-input-bg text-input-text text-sm"
                onChange={(e) => setYearRange([2010, parseInt(e.target.value)])}
              >
                <option value={2024}>Any Year</option>
                <option value={2020}>2020+</option>
                <option value={2018}>2018+</option>
                <option value={2015}>2015+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Carousel */}
      <div
        className="relative"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredCars.length > 0 ? (
          <>
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4 md:gap-6"
                animate={{ x: -currentIndex * (cardWidth + gap) }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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

            {/* Arrows - Hidden on Mobile */}
            {!isMobile && filteredCars.length > cardsToShow && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`absolute -left-12 top-1/2 -translate-y-1/2 bg-primary text-text dark:bg-card-bg p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 z-10 transition-all ${
                    currentIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'opacity-100'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-text" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className={`absolute -right-12 top-1/2 -translate-y-1/2 bg-primary text-text dark:bg-card-bg p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 z-10 transition-all ${
                    currentIndex >= maxIndex
                      ? 'opacity-50 cursor-not-allowed'
                      : 'opacity-100'
                  }`}
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-text" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {filteredCars.length > cardsToShow && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary scale-125'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-secondary-bg rounded-lg">
            <Car size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-card-text text-lg font-medium">
              No cars match your search criteria.
            </p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </section>
  );
}
