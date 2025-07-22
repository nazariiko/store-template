import UserCard from "@/app/_components/Admin/UsersManagement/UserCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function UserCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="px-4 py-6">
      <Suspense fallback={<UserCardSkeleton />}>
        <UserCard id={+id} />
      </Suspense>
    </div>
  );
}

function UserCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-y-2.5">
      <Skeleton className="h-[50px] w-full rounded-2xl" />
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
  );
}
