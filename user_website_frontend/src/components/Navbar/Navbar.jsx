"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Moon,
  Sun,
  Car,
  Phone,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Theme/ThemeProvider";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef(null);

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-heading text-primary-foreground py-2 px-4 text-sm text-center">
        🚗 Free test drive on all vehicles! Limited time offer.
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-text font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              Red Apple Cars
            </span>
          </Link>

          {/* Desktop Navigation (hidden if search is active) */}
          <AnimatePresence>
            {!isSearchActive && (
              <motion.nav
                className="hidden md:flex items-center space-x-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-text hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Right side icons + Search */}
          <div className="flex items-center space-x-4">
            {/* Search with animation */}
            <motion.div
              ref={searchRef}
              className="relative hidden sm:block"
              animate={{
                width: isSearchActive ? 600 : 160, // expanded width
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Search className="text-text absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search cars..."
                className="pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm w-full"
                onFocus={() => setIsSearchActive(true)}
              />
            </motion.div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="text-foreground hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="text-text h-5 w-5" />
              ) : (
                <Moon className="text-text h-5 w-5" />
              )}
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className=" text-foreground hover:bg-accent"
            >
              <Heart className=" text-text h-5 w-5" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden text-foreground hover:bg-accent"
            >
              {isMobileMenuOpen ? (
                <X className="text-text h-6 w-6" />
              ) : (
                <Menu className="text-text h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto py-4 px-4">
              {/* Mobile search */}
              <div className="relative mb-4">
                <Search className=" text-text absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search cars..."
                  className="pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm w-full"
                />
              </div>

              {/* Mobile nav items */}
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-text text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={toggleMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Contact info for mobile */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
