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
import { ILoginUserDto } from "@repo/dto";
import { getMe, loginUser } from "@/lib/api/store/auth";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import SubmitButton from "@/app/_components/ui/SubmitButton";
import { baseServerUrl } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email("Недійсна електронна адреса"),
  password: z.string().min(1, "Обов'язкове поле"),
});

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginWithGoogle = () => {
    const returnUrl = window.location.pathname;
    window.location.href = `${baseServerUrl}/auth/google/login?returnUrl=${returnUrl}&type=login`;
  };

  const onSuccessLogin = async () => {
    const response = await getMe();
    if (response.ok) {
      setUser(response.data.user);
      onClose();
    } else {
      toast.error(response.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: ILoginUserDto = {
      email: values.email,
      password: values.password,
    };
    try {
      const response = await loginUser(data);
      if (!response.ok) {
        toast.error(response.message);
      } else {
        await onSuccessLogin();
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button
          onClick={() => handleLoginWithGoogle()}
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
          Вхід за допомогою Google
        </Button>
        <Separator />
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
        <SubmitButton isSubmitting={form.formState.isSubmitting}>
          Увійти
        </SubmitButton>
      </form>
    </Form>
  );
}
