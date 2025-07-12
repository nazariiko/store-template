import { IGetMeResponse } from "@repo/dto";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserStore {
  user: IGetMeResponse | null;
  setUser: (user: IGetMeResponse) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user: IGetMeResponse) => set({ user }),
    logout: () => set({ user: null }),
  })),
);
