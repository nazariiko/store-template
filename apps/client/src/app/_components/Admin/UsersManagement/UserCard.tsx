import UserCardForm from "@/app/_components/Admin/UsersManagement/UserCardForm";
import { getUser } from "@/lib/api/admin/user";
import { getAllUserRoles } from "@/lib/api/admin/user-roles";
import { IGetUserResponse } from "@repo/dto";
import { redirect } from "next/navigation";

export default async function UserCard({ id }: { id: number }) {
  const { ok, message, data } = await getUser(id);

  if (!ok) {
    redirect(
      `/admin/settings/users?error=${encodeURIComponent(message as string)}`,
    );
  }
  const userRoles = await getAllUserRoles();

  return (
    <UserCardForm
      user={data?.user as IGetUserResponse}
      allUserRoles={userRoles}
    />
  );
}
