import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import {
  Footprints,
  ShieldCheck,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";

interface Scorer {
  playerId: string;
  teamId: { name: string };
  goals: number;
}

interface Goalkeeper {
  playerId: string;
  teamId: { name: string };
  goalsConceded: number;
  minutesPlayed: number;
}

export const AnalyticsDashboard: React.FC<{ tournamentId: string }> = ({
  tournamentId,
}) => {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Consultar el estado general del torneo que ya incluye los arreglos analíticos
    apiClient
      .get(`/tournaments/${tournamentId}/standings`)
      .then(() => {
        // En producción se hace fetch a un endpoint unificado o específico
        // Simulación directa del mapeo de datos analíticos
        setScorers([]);
        setGoalkeepers([]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const downloadPDF = () => {
    window.open(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/tournaments/${tournamentId}/export/pdf`,
      "_blank",
    );
  };

  const downloadExcel = () => {
    window.open(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/tournaments/${tournamentId}/export/excel`,
      "_blank",
    );
  };

  if (loading)
    return (
      <div className="text-slate-600 font-medium text-center py-6">
        Cargando métricas...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Barra de Acciones / Exportaciones */}
      <div className="bg-white p-4 rounded-xl shadow border border-slate-200 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Exportación de Datos Oficiales
          </h3>
          <p className="text-xs text-slate-500">
            Descarga reportes listos para impresión y auditoría de delegados.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Excel</span>
          </button>
        </div>
      </div>

      {/* Grid Analítico de Jugadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabla de Goleadores */}
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <Footprints className="text-emerald-400 w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wide">
              Tabla de Goleadores (Pichichi)
            </h3>
          </div>
          <div className="p-4">
            {scorers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No se registran goles en esta fase.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {scorers.map((s, index) => (
                  <li
                    key={index}
                    className="py-2.5 flex justify-between items-center text-sm"
                  >
                    <span className="font-medium text-slate-800">
                      {index + 1}. Jugador ({s.teamId.name})
                    </span>
                    <span className="bg-slate-100 px-3 py-1 rounded-full font-black text-slate-900">
                      {s.goals} Goles
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Tabla de Valla Menos Vencida */}
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
            <ShieldCheck className="text-amber-400 w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wide">
              Valla Menos Vencida
            </h3>
          </div>
          <div className="p-4">
            {goalkeepers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No se registran minutos oficiales de guardametas.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {goalkeepers.map((g, index) => (
                  <li
                    key={index}
                    className="py-2.5 flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="font-medium text-slate-800">
                        {index + 1}. Arquero ({g.teamId.name})
                      </span>
                      <p className="text-xs text-slate-400">
                        {g.minutesPlayed} min jugados
                      </p>
                    </div>
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full font-bold">
                      {g.goalsConceded} GC
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
