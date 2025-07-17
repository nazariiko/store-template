import RolesManagement from "@/app/_components/Admin/RolesManagement/RolesManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function SettingsRolesPage() {
  return (
    <div className="px-4 py-6">
      <Suspense fallback={<RolesManagementSkeleton />}>
        <RolesManagement />
      </Suspense>
    </div>
  );
}

function RolesManagementSkeleton() {
  return (
    <div className="flex w-full flex-col gap-y-2.5">
      <Skeleton className="h-[50px] w-full rounded-2xl" />
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
  );
}
