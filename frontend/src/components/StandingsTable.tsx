import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { StatsGrid } from "@/components/StatsGrid";
import { Trophy, Shield } from "lucide-react";

interface StandingRow {
  teamId: { _id: string; name: string; shieldUrl?: string };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
}

interface TournamentOverview {
  standings: StandingRow[];
  totalMatches: number;
  totalGoals: number;
  activeSuspensions: number;
}

export const StandingsTable: React.FC<{ tournamentId: string }> = ({
  tournamentId,
}) => {
  const [data, setData] = useState<TournamentOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // La API retorna la información consolidada con los contadores disciplinarios y generales
    apiClient
      .get(`/tournaments/${tournamentId}/overview`)
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Error obteniendo la vista general del torneo:", err),
      )
      .finally(() => setLoading(false));
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="text-center py-10 font-medium text-slate-600">
        Cargando posiciones en tiempo real...
      </div>
    );
  }

  // Fallback seguro si la base de datos está vacía
  const standings = data?.standings || [];

  return (
    <div className="space-y-6">
      {/* 1. Inyección del componente modular de contexto inmediato */}
      <StatsGrid
        totalMatches={data?.totalMatches || 0}
        totalGoals={data?.totalGoals || 0}
        activeSuspensions={data?.activeSuspensions || 0}
      />

      {/* 2. Contenedor estilizado de la Tabla de Posiciones Principal */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3 text-white">
          <Trophy className="text-amber-400 w-5 h-5" />
          <h2 className="text-lg font-bold">Tabla de Posiciones Oficial</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3 text-center w-12">Pos</th>
                <th className="px-6 py-3">Equipo</th>
                <th className="px-4 py-3 text-center">PJ</th>
                <th className="px-4 py-3 text-center">PG</th>
                <th className="px-4 py-3 text-center">PE</th>
                <th className="px-4 py-3 text-center">PP</th>
                <th className="px-4 py-3 text-center">GF</th>
                <th className="px-4 py-3 text-center">GC</th>
                <th className="px-4 py-3 text-center">DG</th>
                <th className="px-6 py-3 text-center bg-emerald-50 text-emerald-900 font-extrabold border-l border-slate-200">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {standings.map((row, idx) => {
                const isTop3 = idx < 3;
                const isRelegation =
                  idx >= standings.length - 2 && standings.length > 4;

                return (
                  <tr
                    key={row.teamId._id}
                    className="group hover:bg-slate-50/80 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                          idx === 0
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : idx === 1
                              ? "bg-slate-200 text-slate-800"
                              : idx === 2
                                ? "bg-orange-100 text-orange-800"
                                : "text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                          {row.teamId.shieldUrl ? (
                            <img
                              src={row.teamId.shieldUrl}
                              alt="shield"
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <Shield className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="truncate">{row.teamId.name}</span>
                        {isTop3 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Clasificado
                          </span>
                        )}
                        {isRelegation && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Repechaje
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-slate-600">
                      {row.played}
                    </td>
                    <td className="px-4 py-4 text-center text-emerald-600 font-semibold">
                      {row.won}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-400 font-medium">
                      {row.drawn}
                    </td>
                    <td className="px-4 py-4 text-center text-rose-600 font-semibold">
                      {row.lost}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-slate-500">
                      {row.goalsFor}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-slate-500">
                      {row.goalsAgainst}
                    </td>
                    <td
                      className={`px-4 py-4 text-center font-bold ${row.goalsDifference > 0 ? "text-emerald-600" : row.goalsDifference < 0 ? "text-rose-600" : "text-slate-400"}`}
                    >
                      {row.goalsDifference > 0
                        ? `+${row.goalsDifference}`
                        : row.goalsDifference}
                    </td>
                    <td className="px-6 py-4 text-center bg-slate-50/50 group-hover:bg-emerald-50/50 transition-colors font-black text-slate-900 text-base border-l border-slate-200">
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
