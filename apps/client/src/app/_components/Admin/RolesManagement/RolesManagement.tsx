import { RolesTable } from "@/app/_components/Admin/RolesManagement/RolesTable";
import { getAllUserRightList } from "@/lib/api/admin/user-right";
import { getUserRolesList } from "@/lib/api/admin/user-roles";

export default async function RolesManagement() {
  const userRoles = await getUserRolesList();
  const userRights = await getAllUserRightList();

  return <RolesTable data={userRoles} userRights={userRights} />;
}
