"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, X, CheckCircle2, AlertCircle, Info, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllNotification } from "@/services/notification/notificationServices";
import { apiClientEvents } from "@/helper/commonHelper";
import { format } from "date-fns";
import { toast } from "sonner";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllNotification({
        page: 1,
        limit: 10
      });

      if (response && response.data && response.data.status) {
        const newNotifications = response.data.data.notifications || [];
        const pagination = response.data.data.pagination || {};

        setNotifications(newNotifications);
        setTotal(pagination.total || 0);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const evtSource = apiClientEvents.events("/notifications/stream", {
      onMessage: (msg) => {
        console.log(msg, "weofjeowij");
        if (msg.type == "notification_update") {
          fetchNotifications();
        }
      },
      onError: (err) => {
        console.error("SSE error:", err);
      }
    });

    return () => evtSource.close();
  }, [fetchNotifications]);

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
      case "create":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "warning":
      case "update":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
      case "delete":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
      case "created":
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Created</Badge>;
      case "warning":
      case "updated":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Updated</Badge>;
      case "error":
      case "delete":
        return <Badge className="bg-red-500 hover:bg-red-600 text-xs">Error</Badge>;
      default:
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">Info</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy · hh:mm a");
    } catch (error) {
      return "Invalid date";
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

  const markAsRead = async (notificationId) => {
    try {
      // You'll need to implement this API call
      // await markNotificationAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif))
      );

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      // You'll need to implement this API call
      // await markAllNotificationsAsRead();

      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setTotal(0);
    toast.success("All notifications cleared");
  };

  const NotificationSkeleton = () => (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-8 w-8 rounded-full bg-border" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4 bg-border" />
            <Skeleton className="h-2 w-1/2 bg-border" />
            <Skeleton className="h-2 w-1/4 bg-border" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative">
      {/* Bell Button with Notification Count */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-lg flex items-center justify-center bg-hoverBg relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-medium">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <Card className="absolute right-0 mt-2 w-96 rounded-xl shadow-lg border bg-background z-50 max-h-[80vh] overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Bell className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-xs text-muted-foreground">{total} total notifications</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-hoverBg">
                  {notifications.filter((n) => !n.read).length} New
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                // Loading state
                <div className="p-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <NotificationSkeleton key={i} />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                // Empty state
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    New notifications will appear here
                  </p>
                </div>
              ) : (
                // Notifications list
                <div className="p-2">
                  {notifications.map((notification) => (
                    <Card
                      key={notification._id}
                      className={`mb-2 transition-colors ${
                        !notification.read
                          ? "border-l-4 border-l-primary bg-blue-50 dark:bg-blue-950/20"
                          : ""
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm leading-tight">
                                  {notification.title || "Notification"}
                                </p>
                                {getNotificationBadge(notification?.type)}
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-2 leading-tight">
                              {notification.message || "No message content"}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatTime(notification.createdAt)}</span>
                              </div>

                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => markAsRead(notification._id)}
                                >
                                  Mark read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
