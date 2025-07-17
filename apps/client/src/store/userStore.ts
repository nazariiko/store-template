import { IGetMeResponse } from "@repo/dto";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserStore {
  user: IGetMeResponse | null;
  isInitialized: boolean;
  setUser: (user: IGetMeResponse) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    isInitialized: false,
    setUser: (user: IGetMeResponse) => set({ user }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),
    logout: () => set({ user: null }),
  })),
);
