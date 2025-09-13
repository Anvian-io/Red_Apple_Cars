"use client";

import { useEffect, useState } from "react";
import { BreadcrumbWrapper } from "..";
import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsDropdown } from "@/components/Notifications/NotificationsDropdown"

export function Header({ isExpanded, pages }) {
  const [time, setTime] = useState(null);
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Africa/Gaborone", // Botswana timezone
      };

      // Get individual time components
      const date = now.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
      });

      const hours = now
        .toLocaleString("en-GB", {
          hour: "2-digit",
          hour12: false,
          ...options,
        }) 
        .split(":")[0].padStart(2, "0");

      const minutes = now.toLocaleString("en-GB", {
        minute: "2-digit",
        ...options,
      }).padStart(2, "0");

      const seconds = String(
        now.toLocaleString("en-GB", { second: "numeric", ...options })
      ).padStart(2, "0");

      setTime({ date, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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
          {/* <span className="text-xs text-muted-foreground">HRS</span> */}
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{"00"}</span>
          {/* <span className="text-xs text-muted-foreground">MIN</span> */}
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{"00"}</span>
          {/* <span className="text-xs text-muted-foreground">SEC</span> */}
        </div>
      </div>
    </div>
  );

  // Timer clock component
  const TimerClock = ({ time }) => (
    <div className="flex items-center gap-2">
      {/* Date */}
      <div className="lg:flex lg:flex-col items-center hidden">
        <span className="text-xs font-medium text-muted-foreground">
          {time.date}
        </span>
      </div>

      {/* Time blocks */}
      <div className="sm:flex items-center gap-1 hidden">
        {/* Hours */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{time.hours}</span>
          {/* <span className="text-xs text-muted-foreground">HRS</span> */}
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{time.minutes}</span>
          {/* <span className="text-xs text-muted-foreground">MIN</span> */}
        </div>

        <div className="text-2xl font-bold text-text animate-pulse">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-[3rem] border-border border">
          <span className="text-lg font-bold text-text">{time.seconds}</span>
          {/* <span className="text-xs text-muted-foreground">SEC</span> */}
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`h-16 transition-all duration-300 ease-in-out fixed top-0 left-0 z-10 flex items-center justify-between px-4 py-2 border-border border bg-sidebar ${isExpanded ? "left-64" : "left-16"
        
              } right-0`}
    >
      {/* Left - Breadcrumb */}
      <BreadcrumbWrapper pages={pages} />

      {/* Right - Icons & Time */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        
<NotificationsDropdown />


        {/* Profile */}
        <Avatar className="w-8 h-8 rounded-lg flex items-center justify-center bg-hoverBg">
          <AvatarImage src="/profile.jpg" alt="@user" />
          <AvatarFallback>U</AvatarFallback>

        </Avatar>

        {/* Timer Clock */}
        {time ? <TimerClock time={time} /> : <TimerSkeleton />}
      </div>
    </header>
  );
}
