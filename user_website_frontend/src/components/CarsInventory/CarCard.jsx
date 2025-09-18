"use client";
import { motion } from "framer-motion";
import { Car, Fuel, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

export default function CarCard({ car }) {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-card rounded-xl shadow-lg overflow-hidden w-full sm:w-70 flex-shrink-0 border"
      style={{
        backgroundColor: theme === "dark" ? "var(--card-bg)" : "white",
        borderColor: theme === "dark" ? "var(--border)" : "#e5e7eb",
      }}
    >
      {/* Car Image - Now with more space */}
      <div className="relative h-80 w-full bg-gradient-to-br from-gray-100 to-gray-200">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.name}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Car className="h-12 w-12" />
          </div>
        )}
        {/* Quick info badge */}
        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {car.year}
        </div>
      </div>

      {/* Compact Car Info */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base truncate max-w-[70%]">{car.name}</h3>
          <p className="text-primary font-bold text-base">{car.price}</p>
        </div>

        {/* Consolidated specs */}
        <div className="flex items-center justify-between mt-4">
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <span>{car.year}</span>
    <span>•</span>
    <span>{car.mileage}</span>
    <span>•</span>
    <span>{car.fuel}</span>
    <span>•</span>
    <span>{car.driveType}</span> {/* Add drive type here */}
  </div>
</div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2 text-sm">
          View Details
        </Button>
      </div>
    </motion.div>
  );
}