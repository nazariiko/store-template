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
import { Form } from "@/components/ui/form";
import { deleteUserRole } from "@/lib/api/admin/user-roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { IGetUserRolesWithIsEditableResponse } from "@repo/dto";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({});

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleDelete = async () => {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDelete)}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Ви впевнені, що хочете видалити роль <br />
                <span className="font-bold">"{role.uaName}"</span>?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Всі користувачі, які мають цю роль, втратять її та всі права,
                які належать цій ролі.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <SubmitButton
                className="w-[150px]"
                variant={"destructive"}
                size={"default"}
                loadingText="Видалення..."
                isSubmitting={form.formState.isSubmitting}
              >
                Видалити
              </SubmitButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
