"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import SubmitButton from "@/app/_components/ui/SubmitButton";
import { getMe, registerUser } from "@/lib/api/store/auth";
import { IRegisterUserDto } from "@repo/dto";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { baseServerUrl } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email("Недійсна електронна адреса"),
  password: z.string().min(8, "Мінімальна довжина паролю 8 символів"),
  firstName: z
    .string()
    .min(1, "Обов'язкове поле")
    .max(100, "Максимальна довжина 100 символів"),
  lastName: z
    .string()
    .min(1, "Обов'язкове поле")
    .max(100, "Максимальна довжина 100 символів"),
  phone: z.string().max(15).optional(),
});

export default function RegisterForm({ onClose }: { onClose: () => void }) {
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const handleRegisterWithGoogle = () => {
    const returnUrl = window.location.pathname;
    window.location.href = `${baseServerUrl}/auth/google/register?returnUrl=${returnUrl}&type=register`;
  };

  const onSuccessRegister = async () => {
    const response = await getMe();
    if (response.ok) {
      setUser(response.data.user);
      onClose();
    } else {
      toast.error(response.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: IRegisterUserDto = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      password: values.password,
      phoneNumber: values.phone,
    };
    try {
      const response = await registerUser(data);
      if (!response.ok) {
        toast.error(response.message);
      } else {
        await onSuccessRegister();
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button
          onClick={() => handleRegisterWithGoogle()}
          variant="outline"
          size="lg"
          className="w-full"
          type="button"
        >
          <Image
            src="/google-icon-logo.svg"
            alt="Google logo"
            width={18}
            height={18}
          />
          Реєстрація з Google
        </Button>
        <Separator />
        <div className="max-h-[200px] space-y-6 overflow-auto p-[3px] sm:max-h-max sm:overflow-visible sm:px-0">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ім'я *</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    type="text"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Прізвище *</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    type="text"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <PhoneInput
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    type="email"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="h-10 pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Пароль"
                      aria-invalid={!!form.formState.errors.password}
                      {...field}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Приховати пароль" : "Показати пароль"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SubmitButton
          className="w-full"
          isSubmitting={form.formState.isSubmitting}
        >
          Створити акаунт
        </SubmitButton>
      </form>
    </Form>
  );
}
