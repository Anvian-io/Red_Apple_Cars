"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "../Theme/ThemeProvider";

export default function AboutUs() {
  const { theme } = useTheme();

  return (
    <section className="py-16 px-4 md:px-20 bg-background text-text">
      {/* Heading */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-heading"
        >
          ABOUT US
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-2 italic text-muted-foreground"
        >
          Driven by Trust, Powered by Passion.
        </motion.p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Founder Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full h-80 md:h-96 rounded-2xl shadow-lg overflow-hidden bg-muted">
            <Image
              src="https://wallpapercave.com/wp/wp5571934.jpg"
              alt="Founder"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Right: Founder Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl text-primary font-medium mb-2">
            Meet the Founder of{" "}
            <span className="font-bold text-heading">RedAppleCars</span>
          </h3>
          <h4 className="text-lg md:text-xl font-bold italic text-primary mb-4">
            Name
          </h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Hi, I'm [Your Name], the founder of RedAppleCars. I started this
            platform with one mission — to make buying and selling pre-owned
            cars simple, safe, and stress-free.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every vehicle is carefully inspected so you get both value and peace
            of mind. With us, it's not just about cars — it's about trust,
            transparency, and helping you find the right ride for your journey
            ahead.
          </p>
        </motion.div>
      </div>
    </section>
  );
}