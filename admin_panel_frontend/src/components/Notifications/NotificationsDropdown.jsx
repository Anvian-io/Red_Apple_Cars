"use client";

import { useState, useEffect } from "react";
import { Bell, X, Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllNotification } from "@/services/notification/notificationServices";
import { apiClientEvents } from "@/helper/commonHelper";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    // if (!open) return;

    setLoading(true);
    try {
      const data = await getAllNotification();
      setNotifications(data.data.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const evtSource = apiClientEvents.events("/notifications/stream", {
      onMessage: (msg) => {
        console.log(msg,'weofjeowij')
        if (msg.type == "notification_update") {
          fetchNotifications();
        }
      },
      onError: (err) => {
        console.error("SSE error:", err);
      }
    });

    return () => evtSource.close();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4" />;
      case "update":
        return <Edit className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "create":
        return "text-green-600 border-l-4 border-l-green-500";
      case "update":
        return "text-blue-600 border-l-4 border-l-blue-500";
      case "delete":
        return "text-red-600 border-l-4 border-l-red-500";
      default:
        return "text-text border-l-4 border-l-gray-500";
    }
  };

  const formatTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell Button with Notification Count */}
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-hoverBg relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <Card className="absolute right-0 mt-2 w-80 rounded-2xl shadow-lg border bg-sidebar z-50">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <span className="text-xs text-muted-foreground">{notifications.length} new</span>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                >
                  Close <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                // Loading state
                <div className="px-4 py-3 border-b animate-pulse">
                  <div className="flex space-x-3">
                    <div className="h-10 w-10 rounded-full bg-hoverBg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-full bg-hoverBg rounded"></div>
                      <div className="h-3 w-3/4 bg-hoverBg rounded"></div>
                    </div>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                // Empty state
                <div className="px-4 py-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                // Notifications list
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className={`px-4 py-3 hover:bg-hoverBg cursor-pointer border-b ${getNotificationStyle(
                        notification.type
                      )}`}
                    >
                      <div className="flex space-x-3">
                        {/* Icon with type-based background */}
                        <div className="flex-shrink-0">
                          <div
                            className={`p-2 rounded-full ${
                              notification.type === "create"
                                ? "bg-green-100"
                                : notification.type === "update"
                                ? "bg-blue-100"
                                : "bg-red-100"
                            }`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-text truncate">
                              {notification.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                notification.type === "create"
                                  ? "bg-green-100 text-green-800"
                                  : notification.type === "update"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {notification.type}
                            </span>
                          </div>

                          <p className="text-sm text-text mb-2">{notification.message}</p>

                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t">
                <button
                  className="w-full text-xs text-muted-foreground hover:underline text-center"
                  onClick={() => setNotifications([])}
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
