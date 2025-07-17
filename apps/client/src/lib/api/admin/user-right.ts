import { cookies } from "next/headers";
import { baseServerUrl } from "@/lib/api";
import { IGetUserRightsResponse } from "@repo/dto";

export const getAllUserRightList = async (): Promise<
  IGetUserRightsResponse[]
> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const data = await fetch(`${baseServerUrl}/admin/user-right`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
    },
    credentials: "include",
  });
  return data.json();
};
