"use client";

import { useEffect, useState } from "react";
import { BreadcrumbWrapper } from "..";
import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
        .split(":")[0];

      const minutes = now.toLocaleString("en-GB", {
        minute: "2-digit",
        ...options,
      });

      const seconds = now.toLocaleString("en-GB", {
        second: "2-digit",
        ...options,
      });

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
      className={`h-16 transition-all duration-300 ease-in-out fixed top-0 left-0 w-full z-10 flex items-center justify-between px-4 py-2 border-border border bg-sidebar ${
        isExpanded
          ? "left-64 w-[calc(100%-16.00001rem)]"
          : "left-16 w-[calc(100%-4.00001rem)]"
      }`}
    >
      {/* Left - Breadcrumb */}
      <BreadcrumbWrapper pages={pages} />

      {/* Right - Icons & Time */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* Profile */}
        <Avatar>
          <AvatarImage src="/profile.jpg" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        {/* Timer Clock */}
        {time ? <TimerClock time={time} /> : <TimerSkeleton />}
      </div>
    </header>
  );
}
