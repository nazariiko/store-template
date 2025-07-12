import { baseServerUrl } from "@/lib/api";
import { TIME_15_MINS, TIME_2_DAYS } from "@repo/dto";

export const getMeOnAdminPanel = async (headers: Headers) => {
  try {
    const response = await fetch(`${baseServerUrl}/admin/auth/me`, {
      method: "GET",
      headers: headers,
      credentials: "include",
    });
    const json = await response.json();
    if (json.ok) {
      const accessToken = json.data.accessToken;
      const refreshToken = json.data.refreshToken;

      return {
        user: json.data.user,
        ok: true,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } else {
      return {
        ok: false,
        message: json.message,
      };
    }
  } catch (error) {
    console.log(error);

    throw new Error("");
  }
};
