"use client";

import AuthDialog from "@/app/_components/Auth/AuthDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserRound } from "lucide-react";
import { useState } from "react";

export default function UserPersonIcon() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cursor-pointer">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <UserRound />
        </DialogTrigger>
        <AuthDialog onClose={() => setIsOpen(false)} />
      </Dialog>
    </div>
  );
}
