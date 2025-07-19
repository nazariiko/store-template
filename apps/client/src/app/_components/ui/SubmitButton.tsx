import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function SubmitButton({
  children,
  isSubmitting,
  variant = "default",
  className = "",
  size = "lg",
  loadingText = "Зачекайте...",
}: Readonly<{
  children: React.ReactNode;
  isSubmitting: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
  size?: "default" | "lg" | "sm" | "icon" | null | undefined;
  loadingText?: string;
}>) {
  if (isSubmitting) {
    return (
      <Button
        disabled
        className={cn("w-full", className)}
        size={size}
        type="submit"
      >
        <Spinner className="text-white" size="small" />
        {loadingText}
      </Button>
    );
  }
  return (
    <Button
      variant={variant}
      className={cn("w-full", className)}
      size={size}
      type="submit"
    >
      {children}
    </Button>
  );
}
