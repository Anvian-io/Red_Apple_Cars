import {
  Home,
  User,
  FileText,
  Car,
  MessageSquareText,
  UserCog,
  BriefcaseBusiness
} from "lucide-react";

export const navItems = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    id: "home",
    pages: "Home"
  },
  {
    icon: Car,
    label: "Cars",
    href: "/cars",
    id: "cars",
    pages: "Home, Cars"
  },
  {
    icon: FileText,
    label: "Invoices",
    href: "/invoices",
    id: "invoices",
    pages: "Home, Invoices"
  },
  {
    icon: MessageSquareText,
    label: "Feedback",
    href: "/feedback",
    id: "feedback",
    pages: "Home, Feedback"
  },
  {
    icon: User,
    label: "Users",
    href: "/user_management",
    id: "users",
    pages: "Home, Users"
  },
  {
    icon: UserCog,
    label: "Roles",
    href: "/roles",
    id: "roles",
    pages: "Home, Roles"
  },
  {
    icon: BriefcaseBusiness,
    label: "Website Services",
    href: "/website-services",
    id: "services",
    pages: "Home, Services"
  }
];
