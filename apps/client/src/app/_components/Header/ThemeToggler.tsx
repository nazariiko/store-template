"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggler() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <Button variant="secondary" size="icon" onClick={toggleTheme}>
      <Sun className="hidden dark:block" />
      <Moon className="light:block hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
