import { useUserStore } from "@/store/userStore";
import { UserRoleId } from "@repo/dto";

export const getUserRank = () => {
  const user = useUserStore.getState().user;
  if (!user || !user.userUserRoles) {
    return 998;
  }

  const ranks = user.userUserRoles.map((userUserRole) => {
    return userUserRole.userRole.rank;
  });
  if (!ranks.length) {
    return 998;
  } else {
    return Math.min(...ranks);
  }
};

export const checkUserPermission = (permission: string) => {
  const user = useUserStore.getState().user;
  if (!user || !user.rights) {
    return false;
  }

  return user.rights.includes(permission);
};
