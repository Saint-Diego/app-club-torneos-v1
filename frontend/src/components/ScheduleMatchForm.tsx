import React, { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import { Calendar, MapPin, Clock, AlertTriangle } from "lucide-react";

interface Court {
  _id: string;
  name: string;
  type: string;
}

interface Venue {
  _id: string;
  name: string;
  courts: Court[];
}

export const ScheduleMatchForm: React.FC<{
  matchId: string;
  onScheduleSuccess: () => void;
}> = ({ matchId, onScheduleSuccess }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [duration, setDuration] = useState<number>(90);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiClient
      .get("/venues")
      .then((res) => setVenues(res.data))
      .catch((err) => console.error("Error cargando sedes:", err));
  }, []);

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVenue(e.target.value);
    setSelectedCourt("");
  };

  const currentVenue = venues.find((v) => v._id === selectedVenue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await apiClient.post(`/matches/${matchId}/schedule`, {
        venueId: selectedVenue,
        courtId: selectedCourt,
        scheduledAt,
        durationMinutes: duration,
      });
      onScheduleSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al agendar la cancha.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-md mx-auto overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center gap-2">
        <Calendar className="text-emerald-400 w-5 h-5" />
        <h3 className="font-bold">Asignación de Cancha y Horario</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Sede Principal
          </label>
          <div className="relative">
            <select
              value={selectedVenue}
              onChange={handleVenueChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm appearance-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Seleccione Sede...</option>
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {currentVenue && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Cancha Disponible
            </label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Seleccione Cancha...</option>
              {currentVenue.courts.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Duración (min)
            </label>
            <div className="relative">
              <input
                type="number"
                min="30"
                step="15"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 90)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Clock className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold p-3 rounded-lg text-sm transition-colors mt-2 shadow disabled:opacity-50"
        >
          {submitting
            ? "Verificando disponibilidad..."
            : "Confirmar Reserva de Cancha"}
        </button>
      </form>
    </div>
  );
};
