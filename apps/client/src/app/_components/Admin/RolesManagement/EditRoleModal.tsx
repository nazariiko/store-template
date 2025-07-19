import SubmitButton from "@/app/_components/ui/SubmitButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyLarge, TypographyP } from "@/components/ui/typography";
import { updateUserRole } from "@/lib/api/admin/user-roles";
import { getUserRank } from "@/lib/helpers/user.helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IGetUserRightsResponse,
  IGetUserRolesWithIsEditableResponse,
} from "@repo/dto";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function EditRoleModal({
  isOpen,
  onClose,
  onCreate,
  userRights,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newRole: IGetUserRolesWithIsEditableResponse) => void;
  userRights: IGetUserRightsResponse[];
  role: IGetUserRolesWithIsEditableResponse;
}) {
  const userRank = getUserRank();
  const minRankUserCanCreate = userRank + 1;
  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Обов'язкове поле")
      .max(50, "Максимальна довжина 50 символів"),
    uaName: z
      .string()
      .min(1, "Обов'язкове поле")
      .max(50, "Максимальна довжина 50 символів"),
    alias: z
      .string()
      .min(1, "Обов'язкове поле")
      .max(50, "Максимальна довжина 50 символів"),
    rank: z
      .number({
        invalid_type_error: "Обов'язкове поле",
      })
      .min(
        minRankUserCanCreate,
        `Мінімальне значення — ${minRankUserCanCreate}`,
      )
      .max(998, "Максимальне значення — 998"),
    selectedRights: z.array(z.number()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role.name,
      uaName: role.uaName,
      alias: role.alias,
      rank: role.rank,
      selectedRights: role.userRoleUserRights.map(
        (userRoleUserRight) => userRoleUserRight.userRight.id,
      ),
    },
  });

  const onSubmit = async (
    data: Omit<
      IGetUserRolesWithIsEditableResponse,
      "id" | "isEditable" | "userRoleUserRights"
    > & { selectedRights: number[] },
  ) => {
    const dto = {
      name: data.name,
      alias: data.alias,
      uaName: data.uaName,
      rank: data.rank,
      userRightIds: data.selectedRights,
    };

    const {
      ok,
      message,
      data: responseData,
    } = await updateUserRole(dto, role.id);
    if (ok) {
      toast.success(message);
      form.reset();
      onClose();
    } else {
      toast.error(message);
      return;
    }

    onCreate({
      ...responseData.userRole,
      isEditable: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Редагування ролі</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="uaName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Модератор товарів"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва (англ.)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Products moderator"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Еліас</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="products_moderator"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ранг</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : Number(value));
                      }}
                      value={field.value === null ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <TypographyLarge className="mb-4 text-base">
                Дозволи
              </TypographyLarge>
              <div className="flex h-[150px] w-full flex-col gap-y-2.5 overflow-y-auto">
                {userRights.map((userRight) => (
                  <FormField
                    key={userRight.id}
                    control={form.control}
                    name="selectedRights"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={userRight.id}
                          className="flex w-full items-center justify-between pr-6"
                        >
                          <TypographyP>{userRight.uaName}</TypographyP>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(userRight.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      userRight.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== userRight.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
            <SubmitButton isSubmitting={form.formState.isSubmitting}>
              Зберегти
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
