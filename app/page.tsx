"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function Page() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/demo");
    }
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [isLoading, user, router]);

  return;
}
