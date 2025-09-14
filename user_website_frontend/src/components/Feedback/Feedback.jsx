"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";
import { getAllFeedback } from "@/services/feedback/feedbackService";

export default function Feedback() {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedbacks from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await getAllFeedback();
        console.log("API Response:", response);
        // Map backend response to frontend structure
        const formattedFeedbacks = response?.data?.data?.map((fb) => ({
          name: fb.CustomerName,
          text: fb.Testimonial,
          rating: fb.rating,
          image: fb.image,
          city: "", // optional, backend doesn't provide city
        })) || [];
        setFeedbacks(formattedFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Duplicate array to create seamless scrolling
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
          animate={{ x: "-50%" }}
          transition={{
            duration: 25,
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
              <div className="relative h-80 w-full bg-muted">
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
                  {fb.name}{fb.city ? `, ${fb.city}` : ""}
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
