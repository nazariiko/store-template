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

const formSchema = z.object({
  email: z.string().email("Недійсна електронна адреса"),
  password: z.string().min(1, "Обов'язкове поле"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button variant="outline" size="lg" className="w-full" type="button">
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
        <Button className="w-full" size="lg" type="submit">
          Увійти
        </Button>
      </form>
    </Form>
  );
}
