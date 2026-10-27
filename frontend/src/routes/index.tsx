import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { LoginForm } from "@/components/LoginForm";
import { MainDashboardOverview } from "@/components/MainDashboardOverview";
import { UnauthorizedView } from "@/components/UnauthorizedView";
import { NotFoundView } from "@/components/NotFoundView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StandingsTable } from "@/components/StandingsTable";
import { MatchReportForm } from "@/components/MatchReportForm";
import { PlayoffBrackets } from "@/components/PlayoffBrackets";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ScheduleMatchForm } from "@/components/ScheduleMatchForm";
import { DisciplinaryPanel } from "@/components/DisciplinaryPanel";
import { RosterManagement } from "@/components/RosterManagement";
import { AuditLogPanel } from "@/components/AuditLogPanel";
import { DashboardLayout } from "./DashboardLayout";
import { PlayerProfileCardWrapper } from "./PlayerProfileCardWrapper";
import { CreateVenueForm } from "@/components/CreateVenueForm";
import { CreateSponsorForm } from "@/components/CreateSponsorForm";
import { CreateTeamForm } from "@/components/CreateTeamForm";
import { CreateUserForm } from "@/components/CreateUserForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // --- Rutas Públicas Abiertas ---
      { index: true, element: <Navigate to="/standings" replace /> },
      { path: "login", element: <LoginForm /> },
      { path: "unauthorized", element: <UnauthorizedView /> },
      { path: "*", element: <NotFoundView /> },
      {
        path: "standings",
        element: <StandingsTable tournamentId="default_id" />,
      },
      {
        path: "playoffs",
        element: <PlayoffBrackets tournamentId="default_id" />,
      },

      // --- ESTRUCTURA SIDEBAR DASHBOARD DE ADMINISTRACIÓN (PROTEGIDA POR RBAC) ---
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { path: "overview", element: <MainDashboardOverview /> },
          {
            path: "analytics",
            element: <AnalyticsDashboard tournamentId="default_id" />,
          },

          // Filtros de acceso complementarios por componente dentro del layout general del Sidebar
          {
            element: <ProtectedRoute allowedRoles={["Admin", "Delegado"]} />,
            children: [
              {
                path: "roster",
                element: <RosterManagement teamId="sampleTeamId" />,
              },
              {
                path: "player/:playerId",
                element: <PlayerProfileCardWrapper />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={["Admin", "Organizador"]} />,
            children: [
              { path: "venues", element: <CreateVenueForm /> },
              { path: "sponsors", element: <CreateSponsorForm /> },
              { path: "teams", element: <CreateTeamForm /> },
              {
                path: "schedule",
                element: (
                  <ScheduleMatchForm
                    matchId="sampleMatchId"
                    onScheduleSuccess={() => alert("Agendado")}
                  />
                ),
              },
              {
                path: "report",
                element: (
                  <MatchReportForm
                    matchId="sampleMatchId"
                    onReportSuccess={() => alert("Guardado")}
                  />
                ),
              },
              {
                path: "discipline",
                element: <DisciplinaryPanel tournamentId="default_id" />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={["Admin"]} />,
            children: [
              { path: "audit", element: <AuditLogPanel /> },
              { path: "users", element: <CreateUserForm /> },
            ],
          },
        ],
      },
    ],
  },
]);
