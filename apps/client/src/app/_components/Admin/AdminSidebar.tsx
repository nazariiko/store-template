"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BookUser,
  ChartNetwork,
  FileBox,
  LayoutDashboard,
  Package,
  ShieldCheck,
  SlidersHorizontal,
  SquareChartGantt,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "@/app/_components/ui/Logo";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Дашборд",
      key: "dashboard",
      showTitle: false,
      items: [
        {
          title: "Дашборд",
          key: "dashboard",
          url: "/admin/dashboard",
          icon: <LayoutDashboard />,
        },
      ],
    },
    {
      title: "Налаштування",
      key: "settings",
      showTitle: true,
      items: [
        {
          title: "Товари",
          key: "products",
          url: "/admin/settings/products",
          icon: <Package />,
        },
        {
          title: "Користувачі",
          key: "users",
          url: "/admin/settings/users",
          icon: <Users />,
        },
        {
          title: "Ролі і доступи",
          key: "roles",
          url: "/admin/settings/roles",
          icon: <ShieldCheck />,
        },
        {
          title: "Загальні",
          key: "common",
          url: "/admin/settings/common",
          icon: <SlidersHorizontal />,
        },
      ],
    },
    {
      title: "Звіти",
      key: "reports",
      showTitle: true,
      items: [
        {
          title: "Товари",
          key: "products",
          url: "/admin/reports/products",
          icon: <FileBox />,
        },
        {
          title: "Замовлення",
          key: "orders",
          url: "/admin/reports/orders",
          icon: <SquareChartGantt />,
        },
        {
          title: "Клієнти",
          key: "clients",
          url: "/admin/reports/clients",
          icon: <BookUser />,
        },
        {
          title: "Робота сайту",
          key: "website",
          url: "/admin/reports/website",
          icon: <ChartNetwork />,
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo className="h-4 w-12" />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            {item.showTitle && (
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
