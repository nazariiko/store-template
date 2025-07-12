"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authErrorMessages } from "@/lib/messages";

export function AuthFailedProvider() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = searchParams.get("auth");
    const errorCode = searchParams.get(
      "message",
    ) as keyof typeof authErrorMessages;

    if (authStatus === "failed") {
      const errorMessage =
        errorCode && authErrorMessages[errorCode]
          ? authErrorMessages[errorCode]
          : authErrorMessages.default;

      toast.error(errorMessage);

      const cleanUrl = `${pathname}`;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [searchParams]);

  return null;
}
