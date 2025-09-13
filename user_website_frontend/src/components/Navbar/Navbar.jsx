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
import Image from "next/image";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
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
          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center space-x-2 z-10 flex-shrink-0">
            {/* Replace with your image logo */}
            {/* <Image 
              src="/logo.png" 
              alt="Red Apple Cars" 
              width={120} 
              height={40} 
              className="h-8 w-auto object-contain"
            /> */}
            <Car className="h-8 w-8 text-primary" />
            <span className="text-text font-bold text-sm sm:text-base md:text-lg lg:text-xl">
              Red Apple Cars
            </span>
          </Link>

          {/* Desktop Navigation - Hidden when search is active */}
          <AnimatePresence>
            {!isSearchActive && (
              <motion.nav
                className="hidden md:flex items-center space-x-6 lg:space-x-8 mx-4"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap text-sm lg:text-base"
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Right side icons - Always visible */}
          <div className="flex items-center space-x-2 sm:space-x-4 z-10">
            {/* Search icon - visible when search is inactive */}
            {!isSearchActive ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-foreground hover:bg-accent"
                aria-label="Search"
              >
                <Search className="text-text h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchActive(false)}
                className="text-foreground hover:bg-accent"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="text-foreground hover:bg-accent hidden sm:flex"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="text-text h-5 w-5" />
              ) : (
                <Moon className="text-text h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent relative"
              aria-label="Favorites"
            >
              <Heart className="text-text h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="text-text h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden text-foreground hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="text-text h-6 w-6" />
              ) : (
                <Menu className="text-text h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Search overlay - appears in center when active */}
          <AnimatePresence>
            {isSearchActive && (
              <motion.div
                ref={searchRef}
                className="absolute inset-0 flex items-center justify-center bg-background z-20 md:z-0"

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="relative w-full max-w-xl mx-4"
                  initial={{ scale: 0.9, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative flex items-center">
                    <Search className="text-text absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search cars, models, brands..."
                      className="pl-10 pr-4 py-3 rounded-full border-2 border-primary bg-background text-base w-full shadow-lg"
                    />
                    <Button 
                      className="absolute right-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-8 w-20 text-sm"
                      onClick={() => {
                        // Handle search functionality
                        console.log('Search initiated:', searchInputRef.current?.value);
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto py-4 px-4">
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

                {/* Mobile theme toggle */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    onClick={handleThemeChange}
                    className="text-foreground hover:bg-accent w-full justify-start"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="text-text h-5 w-5 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="text-text h-5 w-5 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>

                {/* Mobile search - simplified version */}
                <div className="pt-4 border-t border-border">
                  <div className="relative">
                    <Search className="text-text absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      className="pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm w-full"
                    />
                  </div>
                </div>

                {/* Contact info for mobile */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mon-Fri: 9AM-6PM | Sat: 10AM-4PM
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