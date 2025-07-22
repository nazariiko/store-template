"use client";

import { TypographyH4 } from "@/components/ui/typography";
import { usePathname } from "next/navigation";
interface PathNameConfig {
  regex: RegExp;
  uaName: string;
}

const pathNamesData: PathNameConfig[] = [
  {
    regex: /^\/admin\/dashboard$/,
    uaName: "Дашборд",
  },
  {
    regex: /^\/admin\/settings\/roles$/,
    uaName: "Налаштування: Ролі і доступи",
  },
  {
    regex: /^\/admin\/settings\/users$/,
    uaName: "Налаштування: Користувачі",
  },
  {
    regex: /^\/admin\/settings\/users\/\d+$/,
    uaName: "Налаштування: Користувач",
  },
];

function AdminHeaderPageName() {
  const pathname = usePathname();

  const matchedPath = pathNamesData.find((item) => item.regex.test(pathname));
  const uaName = matchedPath?.uaName || null;

  if (!uaName) {
    return null;
  }

  return (
    <div>
      <TypographyH4>{uaName}</TypographyH4>
    </div>
  );
}

export default AdminHeaderPageName;
