import AuthDialog from "@/app/_components/Auth/AuthDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserRound } from "lucide-react";

export default async function UserPersonIcon() {
  return (
    <div className="cursor-pointer">
      <Dialog>
        <DialogTrigger asChild>
          <UserRound />
        </DialogTrigger>
        <AuthDialog />
      </Dialog>
    </div>
  );
}
