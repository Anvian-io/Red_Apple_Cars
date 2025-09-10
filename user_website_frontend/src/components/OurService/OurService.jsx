"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

export default function OurServices() {
  const { theme } = useTheme();
  
  const services = [
    {
      title: "Vehicle Sales",
      description:
        "Browse certified pre-owned vehicles of all types. Find the perfect car that matches your lifestyle and budget.",
      button: "Explore Sales",
      image: "https://d9s1543upwp3n.cloudfront.net/wp-content/uploads/2023/06/shutterstock_2061821273-696x464.jpg",
    },
    {
      title: "Test Drives",
      description:
        "Schedule hassle-free test drives at your convenience. Experience the car firsthand before making a decision.",
      button: "Book Test Drive",
      image: "https://s.driving-tests.org/wp-content/uploads/2012/03/showing-the-car.jpg",
    },
    {
      title: "Financing",
      description:
        "Flexible loan and EMI options tailored to your needs. Drive your dream car with affordable and transparent pricing.",
      button: "Apply Financing",
      image: "https://www.freshbooks.com/wp-content/uploads/2022/02/how-accounts-receivable-financing-works.jpg",
    },
    {
      title: "Trade-In",
      description:
        "Exchange your old car for the best possible market value. Save time and money with a smooth, worry-free process.",
      button: "Get Trade-in Value",
      image: "https://techdrive.co/wp-content/uploads/2019/12/trade-in-car.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-background text-text">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-heading">
          OUR SERVICES
        </h2>
        <p className="italic text-muted-foreground mt-2">
          Beyond Cars – We Drive Your Trust
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-16">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              idx % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-64 md:h-80 w-full bg-muted">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-bold text-heading">{service.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition"
              >
                {service.button}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}