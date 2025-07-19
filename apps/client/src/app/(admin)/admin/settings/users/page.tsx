import UsersManagement from "@/app/_components/Admin/UsersManagement/UsersManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function SettingsUsersPage() {
  return (
    <div className="px-4 py-6">
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
