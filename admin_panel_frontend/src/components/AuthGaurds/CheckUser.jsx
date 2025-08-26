"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/login/page";
export function CheckUser({children}) {
  const router = useRouter();
  const user = localStorage.getItem("User");
//const user = "User"
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  if(user) return <div>{children}</div>;
  else return <div><Login/></div>
}
