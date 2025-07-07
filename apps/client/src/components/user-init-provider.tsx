"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { getMe } from "@/lib/api/store/auth";

export function UserInitializer() {
  const setUser = useUserStore((state) => state.setUser);

  const fetchUser = async () => {
    const response = await getMe();
    if (response.ok) {
      setUser(response.data.user);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [setUser]);

  return null;
}
