import SubmitButton from "@/app/_components/ui/SubmitButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUserRole } from "@/lib/api/admin/user-roles";
import { IGetUserRolesWithIsEditableResponse } from "@repo/dto";
import { toast } from "sonner";

export function DeleteRoleDialog({
  isOpen,
  onClose,
  onDelete,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  role: IGetUserRolesWithIsEditableResponse;
}) {
  const handleDelete = async () => {
    // todo: show preloader or use form with submit button
    const { ok, message } = await deleteUserRole(role.id);
    if (ok) {
      toast.success(message);
      onClose();
    } else {
      toast.error(message);
      onClose();
      return;
    }

    onDelete(role.id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ви впевнені, що хочете видалити роль <br />
            <span className="font-bold">"{role.uaName}"</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Всі користувачі, які мають цю роль, втратять її та всі права, які
            належать цій ролі.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Продовжити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
