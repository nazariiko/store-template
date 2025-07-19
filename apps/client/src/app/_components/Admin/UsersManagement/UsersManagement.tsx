import { UsersTable } from "@/app/_components/Admin/UsersManagement/UsersTable";
import { getUsers } from "@/lib/api/admin/user";
import { getAllUserRightList } from "@/lib/api/admin/user-right";
import { getUserRolesList } from "@/lib/api/admin/user-roles";

export default async function UsersManagement() {
  const users = await getUsers({
    pageNumber: 1,
    limit: 15,
    filters: {},
  });

  // const userRoles = await getAllUserRoles();

  // const onFilter = (filters, pageNumber) => {

  // }

  return <UsersTable data={users} />;
}
