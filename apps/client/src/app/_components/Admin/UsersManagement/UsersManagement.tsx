import { UsersTable } from "@/app/_components/Admin/UsersManagement/UsersTable";
import { getUsers } from "@/lib/api/admin/user";
import { getAllUserRoles } from "@/lib/api/admin/user-roles";

export default async function UsersManagement() {
  const users = await getUsers({
    pageNumber: 1,
    limit: 10,
    filters: {},
  });
  const userRoles = await getAllUserRoles();

  return <UsersTable data={users} userRoles={userRoles} />;
}
