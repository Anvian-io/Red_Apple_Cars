"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

export default function OurServices() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const services = [
    {
      title: "Luxury Vehicle Sales",
      description:
        "Explore our exclusive range of premium and certified vehicles. From SUVs to sedans, Red Apple Cars brings you the best in style, performance, and reliability.",
      button: "Explore Cars",
      image:
        "https://d9s1543upwp3n.cloudfront.net/wp-content/uploads/2023/06/shutterstock_2061821273-696x464.jpg",
    },
    {
      title: "Personalized Test Drives",
      description:
        "Experience your dream car with hassle-free test drives, designed around your schedule. Feel the performance before making the choice.",
      button: "Book a Test Drive",
      image: "https://s.driving-tests.org/wp-content/uploads/2012/03/showing-the-car.jpg",
    },
    {
      title: "Smart Financing",
      description:
        "Drive your dream car without compromise. Our tailored EMI and loan solutions make luxury cars accessible, transparent, and stress-free.",
      button: "Apply for Finance",
      image:
        "https://www.freshbooks.com/wp-content/uploads/2022/02/how-accounts-receivable-financing-works.jpg",
    },
    {
      title: "Seamless Trade-In",
      description:
        "Upgrade with confidence. Exchange your old car at the best market value and enjoy a smooth transition to your next vehicle.",
      button: "Get Trade-In Value",
      image: "https://techdrive.co/wp-content/uploads/2019/12/trade-in-car.jpg",
    },
  ];

  // Simulate loading for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton component
  const SkeletonLoader = () => {
    return (
      <section className="relative py-20 bg-background text-text">
        {/* Background Accent */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary-bg/40 via-background to-background dark:from-black/60 dark:via-black/80 dark:to-black"></div>

        {/* Heading skeleton */}
        <div className="text-center mb-20">
          <div className="h-10 bg-gray-200 rounded-md w-1/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-md w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Services skeleton */}
        <div className="container mx-auto px-6 space-y-24">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image skeleton */}
              <div className="relative w-full md:w-1/2 h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl bg-gray-200 animate-pulse">
                <div className="absolute bottom-6 left-6 h-8 bg-gray-300 rounded-md w-1/2 animate-pulse"></div>
              </div>

              {/* Content skeleton */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-8 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-full w-40 mt-8 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <section className="relative py-20 bg-background text-text">
          {/* Background Accent */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary-bg/40 via-background to-background dark:from-black/60 dark:via-black/80 dark:to-black"></div>

          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-heading tracking-tight">
              Our Premium Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              At <span className="text-primary font-semibold">Red Apple Cars</span>, we redefine the car buying experience with trust, luxury, and unmatched service.
            </p>
          </div>

          {/* Services */}
          <div className="container mx-auto px-6 space-y-24">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-12 ${
                  idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-full md:w-1/2 h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl group"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>
                  <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white drop-shadow-lg">
                    {service.title}
                  </h3>
                </motion.div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold text-heading">{service.title}</h3>
                  <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <Button
                    variant="default"
                    className="mt-8 rounded-full bg-primary text-white px-6 py-2 hover:bg-header transition-transform transform hover:scale-105 shadow-lg"
                  >
                    {service.button}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}