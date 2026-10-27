import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import {
  Shield,
  Goal,
  CalendarDays,
  Clock,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

interface PlayerProfileData {
  player: {
    name?: string;
    position: string;
    jerseyNumber: number;
    dni: string;
    teamId: { name: string; shieldUrl?: string };
    userId?: { name: string; email: string };
  };
  metrics: {
    matchesPlayed: number;
    goals: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
  status: {
    isEligible: boolean;
    suspensionReason: string | null;
  };
}

export const PlayerProfileCard: React.FC<{ playerId: string }> = ({
  playerId,
}) => {
  const [profile, setProfile] = useState<PlayerProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient
      .get(`/players/${playerId}/profile`)
      .then((res) => setProfile(res.data))
      .catch((err) =>
        console.error("Error al obtener la ficha técnica del jugador:", err),
      )
      .finally(() => setLoading(false));
  }, [playerId]);

  if (loading)
    return (
      <div className="text-center py-8 text-slate-500 font-medium">
        Cargando ficha del deportista...
      </div>
    );
  if (!profile)
    return (
      <div className="text-center py-8 text-rose-500 font-semibold">
        No se pudo recuperar el perfil del jugador.
      </div>
    );

  const { player, metrics, status } = profile;
  const playerName = player.userId?.name || player.name || "Deportista Oficial";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Header de Identidad e Insignia de Club */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 text-white shadow border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center font-black text-2xl text-emerald-400 font-mono shadow-inner">
            {player.jerseyNumber}
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">{playerName}</h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {player.position}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1 justify-center sm:justify-start">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>{player.teamId.name}</span>
            </div>
          </div>
        </div>

        {/* Estatus Habilitado / Suspendido */}
        <div className="flex-shrink-0">
          {status.isEligible ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Habilitado</span>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-900 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Suspendido Tribunal</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">
                {status.suspensionReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Grid de Métricas de Rendimiento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Partidos Jugados",
            val: metrics.matchesPlayed,
            icon: CalendarDays,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Goles Anotados",
            val: metrics.goals,
            icon: Goal,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Tarjetas Amarillas",
            val: metrics.yellowCards,
            icon: AlertTriangle,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Tarjetas Rojas",
            val: metrics.redCards,
            icon: AlertTriangle,
            color: "text-rose-500",
            bg: "bg-rose-50",
          },
        ].map((item, index) => {
          // Asignación de iconos fallback estructurados por index
          const Icon =
            index === 0 ? CalendarDays : index === 1 ? Goal : AlertTriangle;
          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center"
            >
              <div
                className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.label}
              </p>
              <h4 className="text-2xl font-black text-slate-800 mt-0.5 font-mono">
                {item.val}
              </h4>
            </div>
          );
        })}
      </div>

      {/* 3. Ficha Técnica Complementaria */}
      <div className="bg-white rounded-xl shadow border border-slate-200 divide-y divide-slate-100">
        <div className="p-4 flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">
            Documento de Identidad (DNI)
          </span>
          <span className="font-mono font-bold text-slate-800">
            {player.dni}
          </span>
        </div>
        <div className="p-4 flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">
            Tiempo en Cancha Oficial
          </span>
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            {metrics.minutesPlayed} minutos
          </span>
        </div>
        {player.userId?.email && (
          <div className="p-4 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Cuenta Vinculada</span>
            <span className="text-slate-600 font-semibold">
              {player.userId.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
