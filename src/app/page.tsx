"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function Home() {
  const { auth } = useApp();
  const router = useRouter();

  useEffect(() => {
    router.replace(auth ? "/dashboard" : "/login");
  }, [auth, router]);

  return null;
}
