import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SubmitButton({
  children,
  isSubmitting,
}: Readonly<{
  children: React.ReactNode;
  isSubmitting: boolean;
}>) {
  if (isSubmitting) {
    return (
      <Button disabled className="w-full" size="lg" type="submit">
        <Spinner className="text-white" size="small" />
        Зачекайте...
      </Button>
    );
  }
  return (
    <Button className="w-full" size="lg" type="submit">
      {children}
    </Button>
  );
}
