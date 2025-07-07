"use client";

import LoginForm from "@/app/_components/Auth/LoginForm";
import RegisterForm from "@/app/_components/Auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function AuthDialog({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>З поверненням! 👋</DialogTitle>
          <DialogDescription>
            Увійдіть, щоб продовжити свою подорож та отримати доступ до
            особистого простору.
          </DialogDescription>
        </VisuallyHidden>
      </DialogHeader>
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Увійти</TabsTrigger>
          <TabsTrigger value="register">Створити акаунт</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>З поверненням! 👋</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm onClose={onClose} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Покращіть свій досвід 🔥</CardTitle>
            </CardHeader>
            <CardContent>
              <RegisterForm onClose={onClose} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
