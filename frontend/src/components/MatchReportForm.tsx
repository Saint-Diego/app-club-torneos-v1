import React, { useState } from "react";
import apiClient from "@/api/apiClient";
import { FileText, Save } from "lucide-react";

interface MatchReportFormProps {
  matchId: string;
  onReportSuccess: () => void;
}

export const MatchReportForm: React.FC<MatchReportFormProps> = ({
  matchId,
  onReportSuccess,
}) => {
  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiClient.post(`/matches/${matchId}/report`, {
        homeGoals,
        awayGoals,
        events: { goals: [], cards: [] }, // Eventos simplificados estructurados para el envío inicial obligatorio
      });
      onReportSuccess();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Error procesando el acta digital.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 max-w-lg mx-auto overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-2 text-white">
        <FileText className="text-emerald-400 w-5 h-5" />
        <h2 className="text-lg font-bold">
          Cierre de Acta Digital del Encuentro
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg font-medium">
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Goles Local
            </label>
            <input
              type="number"
              min="0"
              value={homeGoals}
              onChange={(e) => setHomeGoals(parseInt(e.target.value) || 0)}
              className="w-full text-center text-3xl font-bold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Goles Visitante
            </label>
            <input
              type="number"
              min="0"
              value={awayGoals}
              onChange={(e) => setAwayGoals(parseInt(e.target.value) || 0)}
              className="w-full text-center text-3xl font-bold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl shadow transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSubmitting
            ? "Guardando cambios en tiempo real..."
            : "Cerrar Acta e Ir a Tabla"}
        </button>
      </form>
    </div>
  );
};
