import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "Admin" | "Organizador" | "Delegado" | "Jugador";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "auth-storage" },
  ),
);
