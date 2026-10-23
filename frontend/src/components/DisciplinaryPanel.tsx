import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { ShieldAlert, AlertTriangle, CheckCircle, Search } from "lucide-react";

interface SuspendedPlayer {
  _id: string;
  reason: string;
  matchesSuspended: number;
  matchesServed: number;
  playerId: {
    name: string;
    dni: string;
    jerseyNumber: number;
  };
  teamId: {
    name: string;
  };
}

export const DisciplinaryPanel: React.FC<{ tournamentId: string }> = ({
  tournamentId,
}) => {
  const [suspensions, setSuspensions] = useState<SuspendedPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient
      .get(`/tournaments/${tournamentId}/suspensions`)
      .then((res) => setSuspensions(res.data))
      .catch((err) =>
        console.error("Error cargando el reporte disciplinario:", err),
      )
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const filteredSuspensions = suspensions.filter(
    (s) =>
      s.playerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.teamId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="text-center py-8 text-slate-500 font-medium">
        Consultando el tribunal de disciplina...
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-400 w-5 h-5" />
          <h2 className="text-lg font-bold">
            Reporte de Jugadores Suspendidos
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por equipo o jugador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      <div className="p-4">
        {filteredSuspensions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <p className="text-sm font-semibold">
              ¡Limpio! No hay jugadores sancionados en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuspensions.map((s) => (
              <div
                key={s._id}
                className="border border-red-100 bg-red-50/30 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {s.playerId.name}
                    </span>
                    <span className="text-xs bg-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">
                      DORSAL {s.playerId.jerseyNumber}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    {s.teamId.name}
                  </p>

                  <div className="flex items-center gap-1.5 pt-2 text-xs font-medium text-red-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>Motivo: {s.reason}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-sm">
                    FALTAN {s.matchesSuspended - s.matchesServed} FECHA(S)
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Cumplido: {s.matchesServed}/{s.matchesSuspended}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
