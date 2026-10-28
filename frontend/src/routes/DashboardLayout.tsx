import React, { useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../store/authStore";
import {
  Users,
  CalendarDays,
  ShieldAlert,
  Terminal,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MapPin,
  Award,
  UserPlus,
  Shield,
  type LucideIcon,
} from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const { user, hasRole, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated || !hasRole(["Admin", "Organizador", "Delegado"])) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Estructura completa de navegación interna del Sidebar Corporativo
  const sidebarLinks: {
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

    // Módulos de Gestión de Estructuras e Inscripciones
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
      label: "Configurar Sedes",
      icon: MapPin,
      roles: ["Admin", "Organizador"],
    },
    {
      to: "/dashboard/sponsors",
      label: "Patrocinadores",
      icon: Award,
      roles: ["Admin", "Organizador"],
    },

    // Logística de Campeonato y Actas
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

    // Seguridad y Control Superior
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
    <div className="min-h-[calc(100vh-73px)] flex bg-slate-100 -m-4 md:-m-6 overflow-x-hidden">
      <aside
        className={`hidden md:flex flex-col justify-between bg-slate-900 border-r border-slate-800 text-slate-400 transition-all duration-300 z-40 top-[73px] h-[calc(100vh-73px)] flex-shrink-0 ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
            {!isCollapsed && (
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                LigaPro Console
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white mx-auto transition-colors cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
            {sidebarLinks.map((link, idx) => {
              if (!hasRole(link.roles)) return null;
              const Icon = link.icon;

              return (
                <NavLink
                  key={idx}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-600 text-slate-950 shadow-md shadow-emerald-900/20"
                        : "hover:bg-slate-800 hover:text-white"
                    }`
                  }
                  title={link.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{link.label}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {!isCollapsed && (
          <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-xs font-mono text-center text-slate-500">
            Rol: <span className="text-slate-300 font-bold">{user?.role}</span>
          </div>
        )}
      </aside>

      {/* 
        ZONA DE TRABAJO INDEPENDIENTE
        - overflow-x-auto / overflow-y-auto: Aísla el desbordamiento protegiendo al Sidebar de movimientos no deseados.
        - w-full: Utiliza el remanente espacial exacto.
      */}
      <div className="flex-grow p-4 md:p-8 overflow-y-auto overflow-x-auto h-[calc(100vh-73px)] w-full">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
