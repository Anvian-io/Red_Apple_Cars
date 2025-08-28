import { Navbar,Dashboard } from "@/components";
import { Children } from "react";
export default function Home({Children}) {

  return <div className="min-h-screen bg-background"><Navbar>{Children}</Navbar></div>;
}
