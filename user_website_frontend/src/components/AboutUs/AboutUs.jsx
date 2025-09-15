"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "../Theme/ThemeProvider";
import { useEffect, useState } from "react";

export default function AboutUs() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

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
      <section className="relative py-20 px-6 md:px-20 bg-background text-text overflow-hidden">
        {/* Decorative Red Circle */}
        <div className="absolute top-10 left-[-100px] w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[-120px] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          {/* Left: Image skeleton */}
          <div className="relative group">
            <div className="w-full h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gray-200 animate-pulse"></div>
          </div>

          {/* Right: Content skeleton */}
          <div className="space-y-6">
            {/* Title skeleton */}
            <div className="h-12 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            
            {/* Subtitle skeleton */}
            <div className="h-6 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
            
            {/* Paragraph skeletons */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            </div>
            
            {/* Founder highlight skeleton */}
            <div className="mt-6 space-y-2">
              <div className="h-6 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <section className="relative py-20 px-6 md:px-20 bg-background text-text overflow-hidden">
          {/* Decorative Red Circle */}
          <div className="absolute top-10 left-[-100px] w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-[-120px] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
            {/* Left: Founder / Showroom Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              variants={fadeInUp}
              className="relative group"
            >
              <div className="relative w-full h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/image.png"
                  alt="Red Apple Cars Showroom"
                  fill
                  className="object-cover transform group-hover:scale-105 transition duration-700"
                />
              </div>
              {/* Red Apple Logo Watermark */}
              {/* <div className="absolute -bottom-8 -right-8 bg-primary text-white font-bold text-4xl px-8 py-6 rounded-full shadow-xl">
                🍎
              </div> */}
            </motion.div>

            {/* Right: About Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.2 }}
              className="space-y-6"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-extrabold text-heading leading-tight"
              >
                About <span className="text-primary">Red Apple Cars</span>
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="italic text-lg text-muted-foreground"
              >
                Luxury, Trust & Transparency.
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                At <span className="font-semibold text-primary">Red Apple Cars</span>, we don&apos;t just sell cars  &mdash; we craft
                journeys. Founded with a passion for performance and a vision for
                trust, our mission is to bring you premium pre-owned and new cars
                that fit both your lifestyle and your aspirations.
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                From thorough inspections to transparent pricing, every car at our
                showroom is handpicked to deliver excellence. Whether it&apos;s your first
                car or your dream car, we make sure it&apos;s nothing less than perfect.
              </motion.p>

              {/* Founder Highlight */}
              <motion.div variants={fadeInUp} className="mt-6">
                <h4 className="text-lg font-semibold text-primary">Meet Our Founder</h4>
                <p className="text-muted-foreground">Johnathan Doe, Car Enthusiast & Visionary Entrepreneur</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}