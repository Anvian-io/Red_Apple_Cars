"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

export default function BrandGrid({ brands }) {
  const { theme } = useTheme();

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
