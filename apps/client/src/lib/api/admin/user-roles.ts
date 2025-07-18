"use server";

import { cookies } from "next/headers";
import { baseServerUrl } from "@/lib/api";
import {
  ICreateUserRoleDto,
  IGetUserRolesWithIsEditableResponse,
  IUpdateUserRoleDto,
} from "@repo/dto";
import { IApiResponse } from "@/interfaces/api";

export const getUserRolesList = async (): Promise<
  IGetUserRolesWithIsEditableResponse[]
> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const data = await fetch(
    `${baseServerUrl}/admin/user-role/list-with-is-editable`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
      },
      credentials: "include",
    },
  );
  return data.json();
};

export const createUserRole = async (
  createUserRoleDtoDto: ICreateUserRoleDto,
): Promise<IApiResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  try {
    const response = await fetch(`${baseServerUrl}/admin/user-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
      },
      credentials: "include",
      body: JSON.stringify({
        ...createUserRoleDtoDto,
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error("");
  }
};

export const updateUserRole = async (
  updateUserRoleDtoDto: IUpdateUserRoleDto,
  userRoleId: number,
): Promise<IApiResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  try {
    const response = await fetch(
      `${baseServerUrl}/admin/user-role/${userRoleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...updateUserRoleDtoDto,
        }),
      },
    );
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error("");
  }
};

export const deleteUserRole = async (
  userRoleId: number,
): Promise<IApiResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  try {
    const response = await fetch(
      `${baseServerUrl}/admin/user-role/${userRoleId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
        },
        credentials: "include",
      },
    );
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error("");
  }
};
