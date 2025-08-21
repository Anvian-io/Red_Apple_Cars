"use client";

import React, { useState } from "react";
import {
  Home,
  User,
  Settings,
  FileText,
  Mail,
  Search,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { lightTheme, darkTheme } from "@/app/colors"

export function Navbar({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const theme = isDark ? darkTheme : lightTheme; // 👈 choose theme

  const toggleTheme = () => setIsDark(!isDark);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: User, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Cars", href: "/cars" },
    { icon: Mail, label: "Invoices", href: "/invoices" },
    { icon: Search, label: "Feedback", href: "/feedback" },
    { icon: Settings, label: "Users", href: "/user_management" },
  ];

  return (
    <div className={`h-screen ${theme.background}`}>
      <div className="flex h-full">
        {/* Sidebar */}
        <nav
          className={`
            fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out
            ${isExpanded ? "w-64" : "w-16"}
            ${theme.background}" "${theme.border}
            border-r shadow-lg
          `}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-start h-16 px-4 border-b ${theme.border}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <Menu className={`w-5 h-5 ${theme.text}`} />
              </div>
              <span
                className={`font-semibold text-lg transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                } ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Dashboard
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-6">
            <ul className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${theme.text} ${theme.hover} group relative`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span
                        className={`ml-3 transition-all duration-300 whitespace-nowrap ${
                          isExpanded
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2"
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className={`p-3 border-t ${theme.border}`}>
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className={`w-full justify-start px-3 py-3 h-auto ${theme.text} ${theme.hover}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span
                className={`ml-3 transition-all duration-300 whitespace-nowrap ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </Button>
          </div>
        </nav>

        {/* Main */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out px-8 ${
            isExpanded ? "ml-64" : "ml-16"
          } ${theme.background}`}
        >
          {children || (
            <div className="p-8">
              <div
                className={`rounded-lg p-8 text-center ${theme.cardBg} ${theme.cardText}`}
              >
                <h1 className="text-3xl font-bold mb-4">
                  Welcome to Your Dashboard
                </h1>
                <p className={`text-lg ${theme.text}`}>
                  Hover over the sidebar to expand it.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
