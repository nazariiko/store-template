import { IApiResponse } from "@/interfaces/api";
import { baseServerUrl } from "@/lib/api";
import { IRegisterUserDto } from "@repo/dto";

export const registerUser = async (
  registerUserDto: IRegisterUserDto,
): Promise<IApiResponse> => {
  try {
    const response = await fetch(`${baseServerUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...registerUserDto,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        message: json.message,
        data: null,
      };
    } else {
      return {
        ok: true,
        message: "",
        data: {
          userId: json.userId,
        },
      };
    }
  } catch (error) {
    throw new Error("");
  }
};

export const getMe = async (): Promise<IApiResponse> => {
  try {
    const response = await fetch(`${baseServerUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        message: "",
        data: null,
      };
    } else {
      return {
        ok: true,
        message: "",
        data: {
          user: json.user,
        },
      };
    }
  } catch (error) {
    throw new Error("");
  }
};
