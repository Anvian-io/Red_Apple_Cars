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
      <div className="bg-primary text-white py-2 px-4 text-sm text-center">
        <div className="container mx-auto flex items-center justify-center">
          <span className="mr-2">🚗</span>
          <span>Free test drive on all vehicles! Limited time offer.</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10 flex-shrink-0">
            <div className="relative flex items-center">


              <Image
                src="https://res.cloudinary.com/dp89draup/image/upload/v1757338015/real-red-apple_ncf7fx.png"
                alt="Red Apple Cars Logo"
                width={48}
                height={48}
                className="object-contain w-[38px] h-[38px] md:w-[48px] md:h-[48px]"
                priority
              />


              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold text-heading">RED APPLE</span>
                <span className="text-xs tracking-widest text-primary">CARS</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <AnimatePresence>
            {!isSearchActive && (
              <motion.nav
                className="hidden md:flex items-center space-x-8 mx-4"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-text hover:text-primary transition-colors font-medium relative group text-sm"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 z-10">
            {/* Search icon */}
            {!isSearchActive ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-foreground hover:bg-accent hover:text-primary"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <></>
            )}

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="text-foreground hover:bg-accent hover:text-primary hidden sm:flex"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent hover:text-primary relative"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Contact - hidden on mobile */}
            <div className="hidden lg:flex items-center">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden text-foreground hover:bg-accent hover:text-primary"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Search overlay */}
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search cars, models, brands..."
                      className="pl-10 pr-12 py-3 rounded-full border-2 border-primary bg-background text-base w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearchActive(false)}
                      className="absolute right-2 text-muted-foreground hover:text-primary hover:bg-transparent"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-border bg-background"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto py-4 px-4">
                {/* Mobile nav items */}
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text text-foreground hover:text-primary transition-colors font-medium py-2 border-b border-border/30"
                      onClick={toggleMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile theme toggle */}
                  <div className="pt-2 border-b border-border/30 pb-4">
                    <Button
                      variant="ghost"
                      onClick={handleThemeChange}
                      className="text-foreground hover:bg-accent w-full justify-start"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-5 w-5 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Mobile search */}
                  <div className="pt-4 border-b border-border/30 pb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search inventory..."
                        className="pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Contact info for mobile */}
                  <div className="pt-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}