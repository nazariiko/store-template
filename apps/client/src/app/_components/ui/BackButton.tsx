import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Button size="sm" variant="ghost" className="has-[>svg]:pr-5">
        <ChevronLeft />
        {text}
      </Button>
    </Link>
  );
}
