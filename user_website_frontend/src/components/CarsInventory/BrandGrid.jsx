"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

// Skeleton component for loading state
const BrandGridSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="mt-16">
      <div className="text-center">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg p-4 flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: theme === "dark" ? "var(--card-bg)" : "var(--muted)",
              border: theme === "dark" ? "1px solid var(--border)" : "none",
            }}
          >
            <div className="relative h-10 w-16 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default function BrandGrid({ brands }) {
  const { theme } = useTheme();
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Show skeleton for 3 seconds minimum
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton for 3 seconds
  if (showSkeleton) {
    return <BrandGridSkeleton />;
  }

  return (
    <div className="mt-16">
      <h3 className="text-center font-semibold text-lg text-heading">
        Explore by Brand
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {brands.map((brand, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              backgroundColor:
                theme === "dark" ? "var(--card-bg)" : "var(--muted)",
              border: theme === "dark" ? "1px solid var(--border)" : "none",
            }}
          >
            <div className="relative h-10 w-16 mb-2">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium">{brand.name}</span>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Button className="bg-primary hover:bg-primary/90 text-white">
          View all Cars
        </Button>
      </div>
    </div>
  );
}