import { ShoppingCart } from "lucide-react";

export default function UserCartIcon() {
  const count = 1;
  return (
    <div className="relative cursor-pointer">
      <ShoppingCart />
      <span className="absolute -bottom-[5px] left-[24px] text-xs">
        {count || ""}
      </span>
    </div>
  );
}
