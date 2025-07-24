"use server";

import { cookies } from "next/headers";
import { baseServerUrl } from "@/lib/api";
import {
  IGetUserResponse,
  IGetUsersListFilters,
  IGetUsersResponse,
  IUpdateUserDto,
} from "@repo/dto";

export const getUsers = async (body: {
  pageNumber: number;
  limit: number;
  filters: IGetUsersListFilters;
}): Promise<IGetUsersResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const data = await fetch(`${baseServerUrl}/admin/user/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
    },
    credentials: "include",
    body: JSON.stringify({
      ...body,
    }),
  });
  return data.json();
};

export const getUser = async (
  id: number,
): Promise<{
  ok: boolean;
  message?: string;
  data?: { user: IGetUserResponse };
}> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const data = await fetch(`${baseServerUrl}/admin/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
    },
    credentials: "include",
  });
  return data.json();
};

export const updateUser = async (
  id: number,
  body: IUpdateUserDto,
): Promise<{
  ok: boolean;
  message: string;
}> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const data = await fetch(`${baseServerUrl}/admin/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
    },
    credentials: "include",
    body: JSON.stringify({
      ...body,
    }),
  });
  return data.json();
};

export const deleteUser = async (
  id: number,
): Promise<{
  ok: boolean;
  message: string;
}> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const data = await fetch(`${baseServerUrl}/admin/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}; should_update_tokens=${false}`,
    },
    credentials: "include",
  });
  return data.json();
};
