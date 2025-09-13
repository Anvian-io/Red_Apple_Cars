import { Home, User, FileText, Mail, Search, Settings,Car,ReceiptText,MessageSquareText,UserCog} from "lucide-react";

export const navItems = [
  { icon: Home, label: "Home", href: "/", id: "home", pages: "Home" },
  // {
  //   icon: User,
  //   label: "Dashboard",
  //   href: "/dashboard",
  //   id: "dashboard",
  //   pages: "Home, Dashboard",
  // },
  {
    icon: Car,
    label: "Cars",
    href: "/cars",
    id: "cars",
    pages: "Home, Cars",
  },
  {
    icon: FileText,
    label: "Invoices",
    href: "/invoices",
    id: "invoices",
    pages: "Home, Invoices",
  },
  {
    icon: MessageSquareText,
    label: "Feedback",
    href: "/feedback",
    id: "feedback",
    pages: "Home, Feedback",
  },
  {
    icon: User,
    label: "Users",
    href: "/user_management",
    id: "users",
    pages: "Home, Users",
  },
  {
    icon: UserCog,
    label: "Roles",
    href: "/roles",
    id: "roles",
    pages: "Home, Roles",
  },
];
