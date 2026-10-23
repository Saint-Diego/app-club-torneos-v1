import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { GitFork, Shield } from "lucide-react";

interface PlayoffMatch {
  _id: string;
  phase: "Cuartos" | "Semifinal" | "Final";
  matchCode: string;
  homeTeamId: { name: string; shieldUrl?: string } | null;
  awayTeamId: { name: string; shieldUrl?: string } | null;
  homeGoals: number;
  awayGoals: number;
  winnerTeamId: string | null;
}

export const PlayoffBrackets: React.FC<{ tournamentId: string }> = ({
  tournamentId,
}) => {
  const [matches, setMatches] = useState<PlayoffMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/tournaments/${tournamentId}/playoffs`)
      .then((res) => setMatches(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const filterByPhase = (phase: "Cuartos" | "Semifinal" | "Final") => {
    return matches.filter((m) => m.phase === phase);
  };

  if (loading)
    return (
      <div className="text-center py-8 text-slate-500 font-medium">
        Cargando árbol de eliminación directa...
      </div>
    );

  const TeamRow = ({
    team,
    goals,
    isWinner,
  }: {
    team: any;
    goals: number;
    isWinner: boolean;
  }) => (
    <div
      className={`flex items-center justify-between px-3 py-2 text-sm ${isWinner ? "bg-emerald-50 text-emerald-900 font-bold" : "text-slate-700"}`}
    >
      <div className="flex items-center gap-2 truncate">
        <Shield
          className={`w-4 h-4 ${isWinner ? "text-emerald-500" : "text-slate-400"}`}
        />
        <span className="truncate">{team ? team.name : "Por definir"}</span>
      </div>
      {team && <span className="font-mono text-base">{goals}</span>}
    </div>
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <GitFork className="text-emerald-500 w-6 h-6" />
        <h2 className="text-xl font-bold text-slate-900">
          Fase de Eliminación Directa
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* CUARTOS DE FINAL */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
            Cuartos de Final
          </h3>
          {filterByPhase("Cuartos").map((m) => (
            <div
              key={m._id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden"
            >
              <TeamRow
                team={m.homeTeamId}
                goals={m.homeGoals}
                isWinner={m.winnerTeamId === (m.homeTeamId as any)?._id}
              />
              <TeamRow
                team={m.awayTeamId}
                goals={m.awayGoals}
                isWinner={m.winnerTeamId === (m.awayTeamId as any)?._id}
              />
            </div>
          ))}
        </div>

        {/* SEMIFINAL */}
        <div className="space-y-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
            Semifinal
          </h3>
          {filterByPhase("Semifinal").map((m) => (
            <div
              key={m._id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden lg:my-12"
            >
              <TeamRow
                team={m.homeTeamId}
                goals={m.homeGoals}
                isWinner={m.winnerTeamId === (m.homeTeamId as any)?._id}
              />
              <TeamRow
                team={m.awayTeamId}
                goals={m.awayGoals}
                isWinner={m.winnerTeamId === (m.awayTeamId as any)?._id}
              />
            </div>
          ))}
        </div>

        {/* FINAL */}
        <div className="space-y-4 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
            Gran Final
          </h3>
          {filterByPhase("Final").map((m) => (
            <div
              key={m._id}
              className="bg-slate-900 text-white rounded-xl shadow-md border-2 border-amber-400 divide-y divide-slate-800 overflow-hidden"
            >
              <TeamRow
                team={m.homeTeamId}
                goals={m.homeGoals}
                isWinner={m.winnerTeamId === (m.homeTeamId as any)?._id}
              />
              <TeamRow
                team={m.awayTeamId}
                goals={m.awayGoals}
                isWinner={m.winnerTeamId === (m.awayTeamId as any)?._id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
