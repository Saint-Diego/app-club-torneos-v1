import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../store/authStore";
import {
  Shield,
  LogOut,
  Trophy,
  GitFork,
  Menu,
  X,
  LayoutDashboard,
  Users,
  CalendarDays,
  ShieldAlert,
  Terminal,
  BarChart3,
  LayoutGrid,
  MapPin,
  Award,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export const RootLayout: React.FC = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const isStaff = hasRole(["Admin", "Organizador", "Delegado"]);

  // Listado maestro unificado para el despliegue del menú móvil
  const mobileAdminLinks: {
    to: string;
    label: string;
    icon: LucideIcon;
    roles: UserRole[];
  }[] = [
    {
      to: "/dashboard/overview",
      label: "Resumen General",
      icon: LayoutGrid,
      roles: ["Admin", "Organizador", "Delegado"],
    },
    {
      to: "/dashboard/analytics",
      label: "Métricas Analíticas",
      icon: BarChart3,
      roles: ["Admin", "Organizador", "Delegado"],
    },
    {
      to: "/dashboard/roster",
      label: "Plantilla de Club",
      icon: Users,
      roles: ["Admin", "Delegado"],
    },
    {
      to: "/dashboard/teams",
      label: "Inscribir Equipo",
      icon: Shield,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/venues",
      label: "Nueva Sede / Cancha",
      icon: MapPin,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/sponsors",
      label: "Nuevo Patrocinador",
      icon: Award,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/schedule",
      label: "Agendar Canchas",
      icon: CalendarDays,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/report",
      label: "Cargar Actas",
      icon: ShieldAlert,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/discipline",
      label: "Tribunal Disciplinario",
      icon: ShieldAlert,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/users",
      label: "Registrar Usuario",
      icon: UserPlus,
      roles: ["Admin"],
    },
    {
      to: "/dashboard/audit",
      label: "Auditoría Inmutable",
      icon: Terminal,
      roles: ["Admin"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 text-white shadow-md px-6 py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-white"
          >
            <Shield className="text-emerald-400 w-6 h-6" />
            <span>LigaPro Manager</span>
          </Link>

          {/* Menú de Escritorio (Desktop Navbar) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/standings"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Posiciones</span>
            </Link>
            <Link
              to="/playoffs"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <GitFork className="w-4 h-4" />
              <span>Eliminatorias</span>
            </Link>

            {isAuthenticated && isStaff && (
              <Link
                to="/dashboard/overview"
                className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-900/60"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Panel de Control</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-200">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-slate-800 hover:bg-rose-950 rounded-xl text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Ingresar
              </Link>
            )}
          </nav>

          {/* Hamburguesa Móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú Desplegable Responsivo Celulares (Con todos los nuevos accesos integrados) */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800 px-6 py-4 shadow-xl flex flex-col gap-2 max-h-[calc(100vh-73px)] overflow-y-auto animate-fadeIn">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 block">
              Navegación Pública
            </span>
            <Link
              to="/standings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/60"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Posiciones
            </Link>
            <Link
              to="/playoffs"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/60"
            >
              <GitFork className="w-4 h-4 text-blue-400" /> Eliminatorias
            </Link>

            {isAuthenticated && isStaff && (
              <>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-4 block">
                  Administración y Consola Móvil
                </span>
                {mobileAdminLinks.map((link, idx) => {
                  if (!hasRole(link.roles)) return null;
                  const LinkIcon = link.icon;
                  return (
                    <Link
                      key={idx}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/60 hover:text-white"
                    >
                      <LinkIcon className="w-4 h-4 text-slate-400" />{" "}
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-4 mt-2">
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-rose-950 text-rose-400 rounded-xl text-xs font-bold border border-rose-900"
                >
                  <LogOut className="w-3.5 h-3.5" /> Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-emerald-600 text-slate-900 text-sm font-bold py-2.5 rounded-xl shadow-sm mt-4 block"
              >
                Ingresar
              </Link>
            )}
          </div>
        )}
      </header>
      <main className="flex-grow p-4 md:p-6 w-full mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
