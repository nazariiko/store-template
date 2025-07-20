"use client";

import { AdminSidebar } from "@/app/_components/Admin/AdminSidebar";
import AdminHeader from "@/app/_components/Admin/Header/AdminHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyLarge } from "@/components/ui/typography";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";

export function UserWrapper({ children }: { children: React.ReactNode }) {
  const isInitialized = useUserStore((state) => state.isInitialized);

  if (!isInitialized) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <TypographyLarge className="mt-2.5">
          Завантаження даних, зачекайте...
        </TypographyLarge>
      </div>
    );
  }

  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="overflow-x-auto">
          <AdminHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
