import SubmitButton from "@/app/_components/ui/SubmitButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import { deleteUser } from "@/lib/api/admin/user";
import { deleteUserRole } from "@/lib/api/admin/user-roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { IGetUserResponse } from "@repo/dto";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({});

export function DeleteUserDialog({
  isOpen,
  onClose,
  onDelete,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  user: IGetUserResponse;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleDelete = async () => {
    const { ok, message } = await deleteUser(user.id);
    if (ok) {
      toast.success(message);
      onClose();
    } else {
      toast.error(message);
      onClose();
      return;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleDelete)}
            className="flex flex-col gap-4"
          >
            <AlertDialogHeader>
              <AlertDialogTitle>
                Ви впевнені, що хочете видалити користувача <br />
                <span className="font-bold">"{user.name}"</span>?
              </AlertDialogTitle>
              <AlertDialogDescription>
                При видаленні користувача очищаються всі дані пов'язані з ним.
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
