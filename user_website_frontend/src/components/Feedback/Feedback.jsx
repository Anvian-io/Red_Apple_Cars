"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

export default function Feedback() {
  const { theme } = useTheme();

  const feedbacks = [
    {
      name: "Ramesh",
      city: "Mumbai",
      rating: 4,
      text: "Smooth process, honest staff, and a car well within my budget.",
      image:
        "https://st.depositphotos.com/1011643/4430/i/950/depositphotos_44309759-stock-photo-young-indian-man-outdoors.jpg",
    },
    {
      name: "Priya",
      city: "Pune",
      rating: 5,
      text: "The car was in excellent condition and exactly as promised.",
      image:
        "https://media.sciencephoto.com/image/f0012354/800wm/F0012354-Happy_man.jpg",
    },
    {
      name: "John",
      city: "Navi Mumbai",
      rating: 5,
      text: "Professional service from test drive to paperwork, very reliable.",
      image:
        "https://cdn.pixabay.com/photo/2022/03/11/06/14/indian-man-7061278_640.jpg",
    },
    {
      name: "Amit",
      city: "Delhi",
      rating: 5,
      text: "Excellent staff and smooth trade-in process. Highly recommended!",
      image: "https://img.freepik.com/free-photo/medium-shot-smiley-man-posing_23-2149915892.jpg",
    },
  ];

  // Duplicate array to create seamless loop
  const loopFeedbacks = [...feedbacks, ...feedbacks];

  return (
    <div className="container mx-auto px-4 py-16 bg-background text-text">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-heading">
          HAPPY CUSTOMERS
        </h2>
        <p className="italic text-muted-foreground mt-2">
          Fuelled by Smiles, Backed by Stories
        </p>
      </div>

      {/* Infinite Scrolling Reel */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }} // move half since we duplicated array
          transition={{
            duration: 25, // adjust speed
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loopFeedbacks.map((fb, idx) => (
            <div
              key={idx}
              className="relative min-w-[300px] max-w-sm bg-card rounded-xl shadow-lg overflow-hidden flex-shrink-0"
            >
              {/* Image */}
              <div className="relative h-80 w-full bg-muted"> {/* increased height */}
                <Image
                  src={fb.image}
                  alt={fb.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4">
                <p className="font-semibold">
                  {fb.name}, {fb.city}
                </p>
                <p className="text-sm mt-1 line-clamp-3">{fb.text}</p>
                <div className="flex items-center mt-2">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

        </motion.div>
      </div>

      {/* Share Feedback Button */}
      <div className="text-center mt-12">
        <Button
          variant="outline"
          className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition"
        >
          Share your feedback
        </Button>
      </div>
    </div>
  );
}
