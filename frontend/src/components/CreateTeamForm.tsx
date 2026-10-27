import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/api/apiClient";
import { Shield, Save } from "lucide-react";

const TeamFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  clubId: z.string().min(1, "Debe asociar un Club base"),
  category: z.enum(["Sub-17", "Libre", "Veteranos"]),
  shieldUrl: z.string().url("URL inválida").or(z.literal("")),
});

type TeamFormData = z.infer<typeof TeamFormSchema>;

export const CreateTeamForm: React.FC = () => {
  const [clubs, setClubs] = useState<Array<{ _id: string; name: string }>>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(TeamFormSchema),
  });

  useEffect(() => {
    apiClient
      .get("/clubs")
      .then((res) => setClubs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const onSubmit = async (data: TeamFormData) => {
    try {
      await apiClient.post("/teams", data);
      setMsg("Equipo inscripto en la liga de forma exitosa.");
      reset();
    } catch {
      setMsg("Error al dar de alta el equipo.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md mx-auto overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center gap-2">
        <Shield className="text-emerald-400 w-5 h-5" />
        <h3 className="font-bold">Inscripción de Equipo Federado</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {msg && (
          <div className="p-3 bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg border">
            {msg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Nombre Oficial de la Escuadra
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
            placeholder="Ej: Fuerte FC"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Asociación de Club Institucional
          </label>
          <select
            {...register("clubId")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          >
            <option value="">Seleccione Club...</option>
            {clubs.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.clubId && (
            <p className="text-red-500 text-xs mt-1">{errors.clubId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Categoría del Campeonato
          </label>
          <select
            {...register("category")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          >
            <option value="Libre">Libre / Primera</option>
            <option value="Sub-17">Sub-17 Juvenil</option>
            <option value="Veteranos">Veteranos (+35)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            URL del Escudo Digital
          </label>
          <input
            type="text"
            {...register("shieldUrl")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-emerald-400 font-bold p-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow"
        >
          <Save className="w-4 h-4" /> Registrar Competición
        </button>
      </form>
    </div>
  );
};
