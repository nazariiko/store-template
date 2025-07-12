"use client";

import AuthDialog from "@/app/_components/Auth/AuthDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import { LogOutIcon, UserRound, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { logout as apiLogout } from "@/lib/api/store/auth";
import { UserRight } from "@repo/dto";

export default function UserPersonIcon() {
  const { user, logout } = useUserStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const hasAdminAccess = user?.rights.includes(UserRight.ADMIN_PANEL_ACCESS);

  const handleLogout = async () => {
    logout();
    await apiLogout();
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <UserRound />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={10} align="end" className="w-[150px]">
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              Профіль
            </DropdownMenuItem>
          </Link>
          <Link href="/orders">
            <DropdownMenuItem className="cursor-pointer">
              Мої замовлення
            </DropdownMenuItem>
          </Link>
          {hasAdminAccess && (
            <div>
              <DropdownMenuSeparator />

              <Link href="/admin/dashboard">
                <DropdownMenuItem className="flex cursor-pointer gap-x-2.5">
                  <UserRoundCog />
                  Адмін панель
                </DropdownMenuItem>
              </Link>
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="dark:focus:bg-accent dark:hover:bg-accent flex cursor-pointer gap-x-2.5 text-red-500 hover:bg-red-50 hover:text-red-500 focus:bg-red-50 focus:text-red-500"
          >
            <LogOutIcon className="h-4 w-4 text-red-500" />
            Вийти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="cursor-pointer">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <UserRound />
        </DialogTrigger>
        <AuthDialog onClose={() => setIsOpen(false)} />
      </Dialog>
    </div>
  );
}
