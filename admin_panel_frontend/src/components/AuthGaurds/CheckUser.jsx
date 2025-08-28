"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/login/page";

export function CheckUser({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (user) return <>{children}</>;
  return <Login />;
}
