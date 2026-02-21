"use client";

import { apiClient } from "@/lib/api-client";
import router from "next/router";
import { useEffect } from "react";

export default function ProfilePage() {
  useEffect(() => {
    try {
      apiClient.get("/users/profile");
    } catch (error) {
      router.push("/auth/signin");
    }
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
}
