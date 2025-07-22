import UsersManagement from "@/app/_components/Admin/UsersManagement/UsersManagement";
import ToastErrorProvider from "@/app/_providers/toast-error-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function SettingsUsersPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { error } = await searchParams;

  return (
    <div className="px-4 py-6">
      <ToastErrorProvider message={error} />
      <Suspense fallback={<UsersManagementSkeleton />}>
        <UsersManagement />
      </Suspense>
    </div>
  );
}

function UsersManagementSkeleton() {
  return (
    <div className="flex w-full flex-col gap-y-2.5">
      <Skeleton className="h-[50px] w-full rounded-2xl" />
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
  );
}
