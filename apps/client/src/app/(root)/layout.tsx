import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/app/_providers/theme-provider";

import { getStoreInitialSettings } from "@/lib/api/store/store-main-settings";
import Header from "@/app/_components/Header/Header";
import Footer from "@/app/_components/Footer/Footer";
import { Toaster } from "sonner";
import { UserInitializer } from "@/app/_providers/user-init-provider";
import { AuthFailedProvider } from "@/app/_providers/auth-failed-provider";

export const metadata: Metadata = {
  title: "Store template",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { storeTheme } = await getStoreInitialSettings();
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={storeTheme.alias}
          disableTransitionOnChange
        >
          <Toaster richColors position="top-center" />
          <Header />
          <UserInitializer />
          <AuthFailedProvider />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
