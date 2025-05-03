import HeaderUserActions, {
  SkeletonHeaderUserActions,
} from "@/app/_components/Header/HeaderUserActions";
import Logo from "@/app/_components/Header/Logo";
import { Menu } from "lucide-react";
import { Suspense } from "react";

export default async function Header() {
  return (
    <header className="border-b-border sticky top-0 z-50 w-full border-b-[1px]">
      <div className="container-wrapper">
        <div className="relative container flex h-14 items-center justify-between">
          <div className="md:hidden">
            <Menu className="cursor-pointer" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform md:static md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 md:transform-none">
            <Logo />
          </div>
          <Suspense fallback={<SkeletonHeaderUserActions />}>
            <HeaderUserActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
