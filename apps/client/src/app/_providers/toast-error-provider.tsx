"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function ToastErrorProvider({ message }: { message?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (message && !hasRun.current) {
      toast.error(message);
      hasRun.current = true;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("error");
      router.replace(`/admin/settings/users?${newSearchParams.toString()}`, {
        scroll: false,
      });
    }
  }, [message, router, searchParams]);

  return null;
}
