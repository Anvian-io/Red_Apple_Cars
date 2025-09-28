"use client";

import { useEffect, useState } from "react";
import { BreadcrumbWrapper } from "..";
import { Bell, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsDropdown } from "../Notifications/NotificationsDropdown";

export function Header({ isExpanded, pages }) {
  const [time, setTime] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("User");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Africa/Gaborone" // Botswana timezone
      };

      // Get individual time components
      const date = now.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options
      });

      const hours = now
        .toLocaleString("en-GB", {
          hour: "2-digit",
          hour12: false,
          ...options
        })
        .split(":")[0]
        .padStart(2, "0");

      const minutes = now
        .toLocaleString("en-GB", {
          minute: "2-digit",
          ...options
        })
        .padStart(2, "0");

      const seconds = String(
        now.toLocaleString("en-GB", { second: "numeric", ...options })
      ).padStart(2, "0");

      setTime({ date, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("User");
    setUser(null);
    setShowDropdown(false);
    // You might want to redirect to login page or refresh the app
    // window.location.reload(); or router.push('/login');
  };

  // Skeleton component for loading state
  const TimerSkeleton = () => (
    <div className="sm:flex items-center gap-2 hidden">
      {/* Date */}
      <div className="lg:flex-col items-center hidden lg:flex">
        <span className="text-xs font-medium text-muted-foreground">{""}</span>
      </div>

      {/* Time blocks */}
      <div className="flex items-center gap-1">
        {/* Hours */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{"00"}</span>
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{"00"}</span>
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{"00"}</span>
        </div>
      </div>
    </div>
  );

  // Timer clock component
  const TimerClock = ({ time }) => (
    <div className="flex items-center gap-2">
      {/* Date */}
      <div className="lg:flex lg:flex-col items-center hidden">
        <span className="text-xs font-medium text-muted-foreground">{time.date}</span>
      </div>

      {/* Time blocks */}
      <div className="sm:flex items-center gap-1 hidden">
        {/* Hours */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{time.hours}</span>
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{time.minutes}</span>
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{time.seconds}</span>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`h-16 transition-all duration-300 ease-in-out fixed top-0 left-0 z-10 flex items-center justify-between px-4 py-2 border-border border bg-sidebar ${
        isExpanded ? "left-64" : "left-16"
      } right-0`}
    >
      {/* Left - Breadcrumb */}
      <BreadcrumbWrapper pages={pages} />

      {/* Right - Icons & Time */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <NotificationsDropdown />

        {/* Profile with Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Avatar className="w-8 h-8 rounded-lg flex items-center justify-center bg-hoverBg cursor-pointer">
            <AvatarImage src="/profile.jpg" alt="@user" />
            <AvatarFallback className="text-sm font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-border z-20"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.gmail || user?.email || "No email"}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Timer Clock */}
        {time ? <TimerClock time={time} /> : <TimerSkeleton />}
      </div>
    </header>
  );
}
