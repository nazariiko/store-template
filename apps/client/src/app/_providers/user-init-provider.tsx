"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { getMe } from "@/lib/api/store/auth";

export function UserInitializer() {
  const { setUser, setInitialized } = useUserStore((state) => state);

  const fetchUser = async () => {
    const response = await getMe();
    if (response.ok) {
      setUser(response.data.user);
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [setUser, setInitialized]);

  return null;
}
