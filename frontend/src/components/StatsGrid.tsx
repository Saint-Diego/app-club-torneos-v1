import React from "react";
import { Shield, Goal, AlertCircle, CalendarClock } from "lucide-react";

interface StatsGridProps {
  totalMatches: number;
  totalGoals: number;
  activeSuspensions: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalMatches,
  totalGoals,
  activeSuspensions,
}) => {
  const cards = [
    {
      title: "Partidos Jugados",
      value: totalMatches,
      icon: CalendarClock,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Goles Registrados",
      value: totalGoals,
      icon: Goal,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Jugadores Sancionados",
      value: activeSuspensions,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </p>
              <h4 className="text-3xl font-black text-slate-800 mt-1 font-mono">
                {card.value}
              </h4>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
