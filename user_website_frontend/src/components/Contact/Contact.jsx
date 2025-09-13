"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";

export default function Contact() {
  const { theme } = useTheme();

  return (
    <section className="py-16 px-4 md:px-12 lg:px-20 bg-background text-text">
      {/* Heading */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold tracking-wide text-heading"
        >
          VISIT OUR SHOWROOM
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base italic"
        >
          Experience luxury in person. Our expert team is ready to help you find
          your perfect vehicle.
        </motion.p>
      </div>

      {/* Contact Info + Map */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="bg-secondary p-4 rounded-full">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Address</h4>
              <p className="text-muted-foreground text-sm">
                123 Luxury Drive, Beverly Hills, CA 90210
              </p>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="bg-secondary p-4 rounded-full">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Phone</h4>
              <p className="text-muted-foreground text-sm">(555) 123-4567</p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="bg-secondary p-4 rounded-full">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Email</h4>
              <p className="text-muted-foreground text-sm">info@luxedrive.com</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full h-72 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-md"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.879889722167!2d21.5476!3d-23.9394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eb8a2db4a6a0d2d%3A0x49c07eb9f7a3f0f5!2sXaxa%2C%20Botswana!5e0!3m2!1sen!2s!4v1725827500000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="w-full h-full"
          ></iframe>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-primary/90 transition"
        >
          Schedule Visit
        </motion.button>
      </div>
    </section>
  );
}