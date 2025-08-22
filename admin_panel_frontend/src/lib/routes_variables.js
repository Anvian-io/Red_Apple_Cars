import { Home, User, FileText, Mail, Search, Settings } from "lucide-react";

export const navItems = [
  { icon: Home, label: "Home", href: "/", id: "home", pages: "Home" },
  {
    icon: User,
    label: "Dashboard",
    href: "/dashboard",
    id: "dashboard",
    pages: "Home, Dashboard",
  },
  {
    icon: FileText,
    label: "Cars",
    href: "/cars",
    id: "cars",
    pages: "Home, Cars",
  },
  {
    icon: Mail,
    label: "Invoices",
    href: "/invoices",
    id: "invoices",
    pages: "Home, Invoices",
  },
  {
    icon: Search,
    label: "Feedback",
    href: "/feedback",
    id: "feedback",
    pages: "Home, Feedback",
  },
  {
    icon: Settings,
    label: "Users",
    href: "/user_management",
    id: "users",
    pages: "Home, Users",
  },
  {
    icon: Settings,
    label: "Roles",
    href: "/roles",
    id: "roles",
    pages: "Home, Roles",
  },
];
