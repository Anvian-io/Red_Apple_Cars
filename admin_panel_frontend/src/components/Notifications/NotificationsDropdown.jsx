"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
const A = [1,2,3,4,5]
  // Example notifications
  const notifications = [
    { id: 1, text: "i like icecream", time: "2m ago" },
    { id: 2, text: "my dog ate my homework", time: "15m ago" },
    { id: 3, text: "i want to murder somepeople ", time: "1h ago" },
    { id: 4, text: "i like bikes", time: "3h ago" },
  ];
  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-hoverBg"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
      </Button>

      {/* Dropdown */}
      {open && (
        <Card className="absolute right-0 mt-2 w-80 rounded-2xl shadow-lg border bg-sidebar z-50">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:underline"
              >
                Close
              </button>
            </div>

            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="px-4 py-3 hover:bg-hoverBg cursor-pointer border-b"
                >
                  <p className="text-sm text-text">{n.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {n.time}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
