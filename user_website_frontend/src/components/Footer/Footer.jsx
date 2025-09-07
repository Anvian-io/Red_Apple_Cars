"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-800 text-white py-12 px-6 md:px-20">
      {/* Top Section */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold italic"
        >
          RedAppleCars
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-2 text-sm md:text-base text-gray-200"
        >
          Your trusted destination for premium cars. Redefining every drive
        </motion.p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mb-10">
        {[
          { icon: <Facebook className="w-6 h-6" />, link: "#" },
          { icon: <Twitter className="w-6 h-6" />, link: "#" },
          { icon: <Instagram className="w-6 h-6" />, link: "#" },
        ].map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-red-800 p-3 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            {item.icon}
          </motion.a>
        ))}
      </div>

      {/* Links Section */}
      <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#">Inventory</a></li>
            <li><a href="#">Financing</a></li>
            <li><a href="#">Trade-In</a></li>
            <li><a href="#">Service</a></li>
          </ul>
        </motion.div>

        {/* Vehicle Types */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-3">Vehicle Types</h4>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#">Luxury Sedans</a></li>
            <li><a href="#">Sports Cars</a></li>
            <li><a href="#">SUVs</a></li>
            <li><a href="#">Electric Vehicle</a></li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-3">Contact Info</h4>
          <ul className="space-y-2 text-gray-200 text-sm">
            <li>123 Luxury Drive</li>
            <li>Beverly Hills, CA 90210</li>
            <li>(555) 123-4567</li>
            <li>info@luxedrive.com</li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-sm text-gray-200">
        © 2025 RedAppleCars. All rights reserved.
      </div>
    </footer>
  );
}
