import { getStoreHeaderSettings } from "@/lib/api/store/store-main-settings";
import { Suspense } from "react";

export default async function Header() {
  const headerSettings = await getStoreHeaderSettings();

  return (
    <header className="w-full">
      <div>Static</div>
    </header>
  );
}
