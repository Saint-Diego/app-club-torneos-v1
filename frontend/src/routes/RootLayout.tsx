import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Shield, LogOut, LogIn } from "lucide-react";

export const RootLayout: React.FC = () => {
  const { user, logout, hasRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 text-white shadow-md px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Shield className="text-emerald-400 w-6 h-6" />
          <span>LigaPro Manager</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/standings"
            className="hover:text-emerald-400 transition-colors"
          >
            Posiciones
          </Link>
          {isAuthenticated && user && (
            <>
              {hasRole(["Admin", "Organizador"]) && (
                <Link
                  to="/admin/report"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cargar Actas
                </Link>
              )}
              <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                <span className="text-sm text-slate-300 font-medium">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-slate-800 hover:bg-red-900 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
          <Link
            to="/login"
            className="p-2 bg-slate-800 hover:bg-emerald-600 rounded-3xl text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        </nav>
      </header>
      <main className="flex-grow p-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
