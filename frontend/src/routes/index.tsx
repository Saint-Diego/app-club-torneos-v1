import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { StandingsTable } from "../components/StandingsTable";
import { MatchReportForm } from "../components/MatchReportForm";

// Componentes Mock locales rápidos para flujos genéricos
const LoginMock = () => (
  <div className="p-6 bg-white rounded shadow max-w-sm mx-auto mt-10 text-center">
    <h2 className="text-xl font-bold mb-4">Login Vista</h2>
    <p className="text-sm text-slate-500">Formulario autónomo simulado</p>
  </div>
);
const UnauthorizedMock = () => (
  <div className="p-6 text-center text-red-600 font-bold text-xl">
    403 - Acceso No Autorizado
  </div>
);
const HomeMock = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm">
    <h1 className="text-3xl font-extrabold text-slate-800">
      Panel Central Deportivo
    </h1>
    <p className="text-slate-600 mt-2">
      Bienvenido a la administración automatizada en tiempo real.
    </p>
  </div>
);

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
      { path: "login", element: <LoginMock /> },
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
