"use client";

import { TypographyH4 } from "@/components/ui/typography";
import { usePathname } from "next/navigation";

const pathNamesData = [
  {
    pathname: "/admin/dashboard",
    uaName: "Дашборд",
  },
  {
    pathname: "/admin/settings/roles",
    uaName: "Налаштування: Ролі і доступи",
  },
  {
    pathname: "/admin/settings/users",
    uaName: "Налаштування: Користувачі",
  },
];

function AdminHeaderPageName() {
  const pathname = usePathname();
  const uaName = pathNamesData.find(
    (item) => item.pathname === pathname,
  )?.uaName;

  return (
    <div>
      <TypographyH4>{uaName}</TypographyH4>
    </div>
  );
}

export default AdminHeaderPageName;
