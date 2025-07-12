import Search from "@/app/_components/Header/Search";
import ThemeToggler from "@/app/_components/ui/ThemeToggler";
import UserCartIcon from "@/app/_components/Header/UserCartIcon";
import UserFavoritesIcon from "@/app/_components/Header/UserFavoritesIcon";
import UserPersonIcon from "@/app/_components/Header/UserPersonIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreHeaderSettings } from "@/lib/api/store/store-main-settings";

export default async function HeaderUserActions() {
  const {
    isSearchInHeaderEnabled,
    isFavoritesEnabled,
    isUserAuthEnabled,
    isThemeTogglerEnabled,
  } = await getStoreHeaderSettings();
  return (
    <div className="flex items-center gap-5">
      {isSearchInHeaderEnabled && (
        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:block">
          <Search />
        </div>
      )}
      {isFavoritesEnabled && <UserFavoritesIcon />}
      <UserCartIcon />
      {isUserAuthEnabled && <UserPersonIcon />}
      {isThemeTogglerEnabled && (
        <div className="hidden md:block">
          <ThemeToggler />
        </div>
      )}
    </div>
  );
}

export function SkeletonHeaderUserActions() {
  return <Skeleton className="h-[24px] w-[24px] rounded-full" />;
}
