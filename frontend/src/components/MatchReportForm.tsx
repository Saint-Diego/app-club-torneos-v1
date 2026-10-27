import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { AlertCircle, FileText, Save, Trash2, Shield } from "lucide-react";

interface PlayerLite {
  _id: string;
  jerseyNumber: number;
  position: string;
  name: string;
}

interface MatchDetails {
  _id: string;
  homeTeamId: { _id: string; name: string };
  awayTeamId: { _id: string; name: string };
  homeGoals: number;
  awayGoals: number;
}

export const MatchReportForm: React.FC<{
  matchId: string;
  onReportSuccess: () => void;
}> = ({ matchId, onReportSuccess }) => {
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [homePlayers, setHomePlayers] = useState<PlayerLite[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Estados del Acta
  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);
  const [goals, setGoals] = useState<
    Array<{ playerId: string; minute: number }>
  >([]);
  const [cards, setCards] = useState<
    Array<{ playerId: string; type: "Yellow" | "Red"; minute: number }>
  >([]);

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchMatchContext = async () => {
      setLoading(true);
      setLoadError(false);
      setMatch(null);
      setHomePlayers([]);
      setAwayPlayers([]);

      try {
        const resMatch = await apiClient.get(`/matches/${matchId}`);

        const resHomeRoster = await apiClient.get(
          `/teams/${resMatch.data.homeTeamId._id}/roster`,
        );
        setHomePlayers(resHomeRoster.data);

        const resAwayRoster = await apiClient.get(
          `/teams/${resMatch.data.awayTeamId._id}/roster`,
        );

        if (isCurrentRequest) {
          setMatch(resMatch.data);
          setHomeGoals(resMatch.data.homeGoals);
          setAwayGoals(resMatch.data.awayGoals);
          setHomePlayers(resHomeRoster.data);
          setAwayPlayers(resAwayRoster.data);
        }
      } catch (err) {
        console.error("Error cargando contexto del encuentro:", err);
        if (isCurrentRequest) {
          setLoadError(true);
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    fetchMatchContext();

    return () => {
      isCurrentRequest = false;
    };
  }, [matchId, retryCount]);

  const addGoalEvent = (playerId: string) => {
    setGoals([...goals, { playerId, minute: 45 }]);
  };

  const addCardEvent = (playerId: string, type: "Yellow" | "Red") => {
    setCards([...cards, { playerId, type, minute: 45 }]);
  };

  const removeGoal = (idx: number) =>
    setGoals(goals.filter((_, i) => i !== idx));
  const removeCard = (idx: number) =>
    setCards(cards.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/matches/${matchId}/report`, {
        homeGoals,
        awayGoals,
        events: { goals, cards },
      });
      onReportSuccess();
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Error al guardar reporte de incidencias",
      );
    }
  };

  if (loading) {
    return (
      <div
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">Cargando el acta y las plantillas...</span>
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
        <div className="h-[28rem] rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (loadError || !match) {
    return (
      <div
        className="max-w-xl mx-auto rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"
        role="alert"
      >
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-rose-500" />
        <h3 className="font-bold text-slate-900">
          No se pudo cargar el acta
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Ocurrió un problema al cargar el partido o las plantillas. Verifica tu
          conexión e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const allPlayers = [...homePlayers, ...awayPlayers];
  const getPlayerName = (id: string) =>
    allPlayers.find((p) => p._id === id)?.name || "Jugador";

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-2 space-y-6">
        {/* Marcador Principal */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow border border-slate-800 text-center">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Shield className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <h3 className="font-bold text-lg">{match?.homeTeamId.name}</h3>
              <input
                type="number"
                min="0"
                value={homeGoals}
                onChange={(e) => setHomeGoals(parseInt(e.target.value) || 0)}
                className="w-20 text-center text-4xl bg-slate-800 rounded-xl p-2 font-black mt-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="text-slate-500 font-mono text-xl">VS</div>
            <div className="flex-1">
              <Shield className="w-8 h-8 mx-auto text-blue-400 mb-2" />
              <h3 className="font-bold text-lg">{match?.awayTeamId.name}</h3>
              <input
                type="number"
                min="0"
                value={awayGoals}
                onChange={(e) => setAwayGoals(parseInt(e.target.value) || 0)}
                className="w-20 text-center text-4xl bg-slate-800 rounded-xl p-2 font-black mt-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Listas de Eventos de Incidencias */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" /> Eventos Anotados
            en Planilla
          </h4>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase">
              Goles Registrados
            </h5>
            {goals.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-sm border"
              >
                <span>⚽ {getPlayerName(g.playerId)}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={g.minute}
                    onChange={(e) => {
                      const newGoals = [...goals];
                      newGoals[i].minute = parseInt(e.target.value) || 0;
                      setGoals(newGoals);
                    }}
                    className="w-14 text-center bg-white border rounded p-1 text-xs"
                  />
                  <button
                    onClick={() => removeGoal(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase">
              Tarjetas Asignadas
            </h5>
            {cards.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-sm border"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-3 h-4 inline-block rounded-sm ${c.type === "Yellow" ? "bg-amber-400" : "bg-rose-500"}`}
                  ></span>
                  {getPlayerName(c.playerId)}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={c.minute}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[i].minute = parseInt(e.target.value) || 0;
                      setCards(newCards);
                    }}
                    className="w-14 text-center bg-white border rounded p-1 text-xs"
                  />
                  <button
                    onClick={() => removeCard(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selectores de Jugadores del Partido */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Bloque Local */}
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-600 mb-3 tracking-wider">
            {match?.homeTeamId.name} (Local)
          </h4>
          <div className="space-y-2">
            {homePlayers.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between text-xs border-b pb-2"
              >
                <span className="font-semibold text-slate-700 font-mono">
                  #{p.jerseyNumber} {p.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => addGoalEvent(p._id)}
                    className="bg-slate-100 hover:bg-emerald-50 text-slate-700 p-1.5 rounded transition-colors"
                    title="Anotar Gol"
                  >
                    ⚽
                  </button>
                  <button
                    onClick={() => addCardEvent(p._id, "Yellow")}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-1.5 py-1 rounded font-bold"
                    title="Amarilla"
                  >
                    A
                  </button>
                  <button
                    onClick={() => addCardEvent(p._id, "Red")}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-1.5 py-1 rounded font-bold"
                    title="Roja"
                  >
                    R
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque Visitante */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-black uppercase text-blue-600 mb-3 tracking-wider">
            {match?.awayTeamId.name} (Visitante)
          </h4>
          <div className="space-y-2">
            {awayPlayers.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between text-xs border-b pb-2"
              >
                <span className="font-semibold text-slate-700 font-mono">
                  #{p.jerseyNumber} {p.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => addGoalEvent(p._id)}
                    className="bg-slate-100 hover:bg-emerald-50 text-slate-700 p-1.5 rounded transition-colors"
                  >
                    ⚽
                  </button>
                  <button
                    onClick={() => addCardEvent(p._id, "Yellow")}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-1.5 py-1 rounded font-bold"
                  >
                    A
                  </button>
                  <button
                    onClick={() => addCardEvent(p._id, "Red")}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-1.5 py-1 rounded font-bold"
                  >
                    R
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all mt-4"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Acta e Incidencias</span>
        </button>
      </div>
    </div>
  );
};
