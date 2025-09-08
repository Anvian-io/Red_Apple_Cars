"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react";
import CarCard from "./CarCard";

export default function BodyTypeSlider({ allCars, bodyTypes }) {
  const [activeBodyType, setActiveBodyType] = useState("All");
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [yearRange, setYearRange] = useState([2010, 2024]);
  const [showFilters, setShowFilters] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef(null);

  // Filter cars based on active filters
  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      // Body type filter
      const bodyTypeMatch = activeBodyType === "All" || car.bodyType === activeBodyType;
      
      // Search term filter
      const searchMatch = searchTerm === "" || 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.bodyType.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Price range filter
      const numericPrice = parseInt(car.price.replace(/[^0-9]/g, ''));
      const priceMatch = numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
      
      // Year filter
      const yearMatch = car.year >= yearRange[0] && car.year <= yearRange[1];
      
      return bodyTypeMatch && searchMatch && priceMatch && yearMatch;
    });
  }, [allCars, activeBodyType, searchTerm, priceRange, yearRange]);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Calculate card width including gap
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 40; // gap-6 = 24px
      const calculatedWidth = (containerWidth - (gap * (cardsToShow - 1))) / cardsToShow;
      setCardWidth(calculatedWidth);
    }
  }, [cardsToShow, filteredCars]);

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredCars]);

  const handleNext = () => {
    if (currentIndex < filteredCars.length - cardsToShow) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const maxIndex = Math.max(0, filteredCars.length - cardsToShow);
  const gap = 24; // gap-6 = 24px

  return (
    <div className="mt-16">
      <h3 className="text-center text-xl md:text-2xl font-bold text-heading mb-8">
        Explore by Body Type
      </h3>
      
      {/* Search and Filter Bar */}
      <div className="mb-8 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cars by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex items-center gap-4">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Year Range</h4>
                <div className="flex items-center gap-4">
                  <span>{yearRange[0]}</span>
                  <input
                    type="range"
                    min="1990"
                    max="2024"
                    step="1"
                    value={yearRange[0]}
                    onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                    className="w-full"
                  />
                  <span>{yearRange[1]}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setPriceRange([0, 200000]);
                  setYearRange([2010, 2024]);
                }}
                className="text-sm text-primary hover:underline"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Body Type Filters */}
      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8 px-4">
        {["All", ...bodyTypes].map((type, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveBodyType(type)}
            className={`px-4 py-2 text-sm md:text-base rounded-full transition-colors ${
              activeBodyType === type
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {type}
          </motion.button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''}
          {activeBodyType !== "All" ? ` in ${activeBodyType}` : ""}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative px-4" ref={containerRef}>
        {filteredCars.length > 0 ? (
          <>
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: -currentIndex * (cardWidth + gap) }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: `${filteredCars.length * (cardWidth + gap)}px` }}
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

            {/* Navigation Arrows */}
            {filteredCars.length > cardsToShow && (
              <>
                <button
  onClick={handlePrev}
  disabled={currentIndex === 0}
  className={`absolute -left-8 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-100 z-10 transition-opacity ${
    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
  }`}
>
  <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-800" />
</button>

<button
  onClick={handleNext}
  disabled={currentIndex >= maxIndex}
  className={`absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-100 z-10 transition-opacity ${
    currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
  }`}
>
  <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-800" />
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
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // No results message
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No cars match your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveBodyType("All");
                setPriceRange([0, 200000]);
                setYearRange([2010, 2024]);
              }}
              className="mt-4 text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}