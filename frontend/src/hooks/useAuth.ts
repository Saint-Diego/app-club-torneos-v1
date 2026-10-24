import { useAuthStore, UserRole } from "../store/authStore";
import apiClient from "../api/apiClient";

export const useAuth = () => {
  const { token, user, setAuth, logout: clearAuth } = useAuthStore();

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { token: jwtToken, user: userProfile } = response.data;
    setAuth(jwtToken, userProfile);
  };

  const logout = (): void => {
    clearAuth();
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
    hasRole,
  };
};
