import AdminHeaderPageName from "@/app/_components/Admin/Header/AdminHeaderPageName";
import ThemeToggler from "@/app/_components/ui/ThemeToggler";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="mr-2 -ml-1" />
      <AdminHeaderPageName />
      <div className="ml-auto flex items-center gap-4">
        <Link href="/">
          <Button variant="default">Повернутись в магазин</Button>
        </Link>
        <ThemeToggler />
      </div>
    </header>
  );
}

export default AdminHeader;
