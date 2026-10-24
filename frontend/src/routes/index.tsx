import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { LoginForm } from "@/components/LoginForm";
import { HomeMock } from "@/components/HomeMock";
import { UnauthorizedMock } from "@/components/UnauthorizedMock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StandingsTable } from "@/components/StandingsTable";
import { MatchReportForm } from "@/components/MatchReportForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomeMock /> },
      {
        path: "standings",
        element: <StandingsTable tournamentId="default_id" />,
      },
      { path: "login", element: <LoginForm /> },
      { path: "unauthorized", element: <UnauthorizedMock /> },
      {
        element: <ProtectedRoute allowedRoles={["Admin", "Organizador"]} />,
        children: [
          {
            path: "admin/report",
            element: (
              <MatchReportForm
                matchId="sampleMatchId"
                onReportSuccess={() => alert("¡Acta guardada!")}
              />
            ),
          },
        ],
      },
    ],
  },
]);
