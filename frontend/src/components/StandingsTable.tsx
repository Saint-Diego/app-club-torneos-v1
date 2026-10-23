import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { Trophy, Activity } from "lucide-react";

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

export const StandingsTable: React.FC<{ tournamentId: string }> = ({
  tournamentId,
}) => {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient
      .get(`/tournaments/${tournamentId}/standings`)
      .then((res) => setStandings(res.data))
      .catch((err) => console.error("Error obteniendo posiciones:", err))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  if (loading)
    return (
      <div className="text-center py-10 font-medium text-slate-600">
        Cargando posiciones en tiempo real...
      </div>
    );

  return (
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
              <th className="px-6 py-3 text-center bg-emerald-50 text-emerald-900 font-extrabold">
                PTS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {standings.map((row, idx) => (
              <tr
                key={row.teamId._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 text-center font-bold text-slate-500">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                  {row.teamId.shieldUrl && (
                    <img
                      src={row.teamId.shieldUrl}
                      alt="shield"
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  {row.teamId.name}
                </td>
                <td className="px-4 py-4 text-center">{row.played}</td>
                <td className="px-4 py-4 text-center text-emerald-600 font-medium">
                  {row.won}
                </td>
                <td className="px-4 py-4 text-center text-slate-500">
                  {row.drawn}
                </td>
                <td className="px-4 py-4 text-center text-red-600 font-medium">
                  {row.lost}
                </td>
                <td className="px-4 py-4 text-center">{row.goalsFor}</td>
                <td className="px-4 py-4 text-center">{row.goalsAgainst}</td>
                <td className="px-4 py-4 text-center font-medium">
                  {row.goalsDifference > 0
                    ? `+${row.goalsDifference}`
                    : row.goalsDifference}
                </td>
                <td className="px-6 py-4 text-center bg-emerald-50 text-emerald-700 font-black text-base">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
