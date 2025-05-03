import { Heart } from "lucide-react";

export default async function UserFavoritesIcon() {
  const count = 1;
  return (
    <div className="relative cursor-pointer">
      <Heart className="text-rose-500" />
      <span className="absolute -bottom-[5px] left-[20px] text-xs text-rose-500">
        {count || ""}
      </span>
    </div>
  );
}
