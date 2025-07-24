"use client";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import BackButton from "@/app/_components/ui/BackButton";
import SubmitButton from "@/app/_components/ui/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IGetAllUserRolesResponse,
  IGetUserResponse,
  IUserRole,
  TIME_3_SECONDS,
} from "@repo/dto";
import { CheckCheck, MailWarning, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TypographyH4 } from "@/components/ui/typography";
import { MultiSelect } from "@/components/ui/multi-select";
import { getUserRank } from "@/lib/helpers/user.helpers";
import { updateUser } from "@/lib/api/admin/user";
import { toast } from "sonner";
import { DeleteUserDialog } from "@/app/_components/Admin/UsersManagement/DeleteUserDialog";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Обов'язкове поле")
    .max(250, "Максимальна довжина 250 символів"),
  email: z.string().email("Недійсна електронна адреса"),
  phone: z.string().max(15).optional(),
});

export default function UserCardForm({
  user,
  allUserRoles,
}: {
  user: IGetUserResponse;
  allUserRoles: IGetAllUserRolesResponse[];
}) {
  const router = useRouter();
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>(
    user.userUserRoles?.map((item) => (item.userRole as IUserRole).alias) || [],
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const userRank = getUserRank();
  const rolesList = allUserRoles.map((userRole) => {
    const disabled = userRole.rank <= userRank;
    return {
      value: userRole.alias,
      label: userRole.uaName,
      disabled: disabled,
    };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phoneNumber || "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    const userRoleIds: number[] = [];
    selectedUserRoles.forEach((alias) => {
      const userRole = allUserRoles.find(
        (userRole) => userRole.alias === alias,
      );
      if (userRole) {
        userRoleIds.push(userRole.id);
      }
    });
    const { ok, message } = await updateUser(user.id, {
      name: data.name,
      phone: data.phone || "",
      userRoleIds: userRoleIds,
    });
    if (ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const onDelete = () => {
    setTimeout(() => {
      router.push("/admin/settings/users");
    }, 6000);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full items-center justify-between">
            <BackButton text="До реєстру" href="/admin/settings/users" />
            <div className="flex gap-x-2">
              {user.deletable && (
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 />
                </Button>
              )}
              {user.editable && (
                <SubmitButton
                  size={"icon"}
                  loadingText=""
                  isSubmitting={form.formState.isSubmitting}
                >
                  <Save />
                </SubmitButton>
              )}
            </div>
          </div>

          <div>
            <TypographyH4 className="mb-5">Основна інформація</TypographyH4>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ім'я *</FormLabel>
                    <FormControl>
                      <Input
                        disabled={!user.editable}
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end gap-x-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grow-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  {user.isEmailVerified ? (
                    <>
                      <CheckCheck className="text-green-500" />
                      <span className="text-sm text-green-500">
                        Пошта підтверджена
                      </span>
                    </>
                  ) : (
                    <>
                      <MailWarning className="text-orange-500" />
                      <span className="hidden text-sm text-orange-500 md:block">
                        Пошта не підтверджена
                      </span>
                    </>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <PhoneInput
                        disabled={!user.editable}
                        international
                        defaultCountry="UA"
                        className="custom-phone-input border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full flex-col gap-y-2">
                <span className="text-sm font-medium">Ролі</span>
                <MultiSelect
                  disabled={!user.editable}
                  options={rolesList}
                  onValueChange={setSelectedUserRoles}
                  defaultValue={selectedUserRoles}
                  placeholder="Оберіть ролі"
                  variant="default"
                  maxCount={10}
                  showClearIcon={false}
                  showSelectAll={false}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
      {isDeleteOpen && (
        <DeleteUserDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={onDelete}
          user={user}
        />
      )}
    </div>
  );
}
