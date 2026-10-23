import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/api/apiClient";
import {
  Users,
  UserPlus,
  Shield,
  ClipboardList,
  Trash2,
  AlertCircle,
} from "lucide-react";

// Esquema de validación en Frontend con Zod
const RosterMemberSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    role: z.enum(["Delegado", "Jugador"]),
    dni: z
      .string()
      .min(6, "El DNI o documento debe tener al menos 6 caracteres"),
    jerseyNumber: z
      .preprocess((val) => Number(val), z.number().min(1).max(99).optional())
      .optional(),
    position: z.string().min(2, "La posición es requerida").optional(),
  })
  .refine(
    (data) => {
      if (data.role === "Jugador") {
        return data.jerseyNumber !== undefined && data.position !== undefined;
      }
      return true;
    },
    {
      message: "Número de camiseta y posición son obligatorios para Jugadores",
      path: ["position"],
    },
  );

type RosterMemberFormData = z.infer<typeof RosterMemberSchema>;

interface Member {
  _id: string;
  name: string;
  email: string;
  role: "Delegado" | "Jugador";
  dni: string;
  jerseyNumber?: number;
  position?: string;
}

export const RosterManagement: React.FC<{ teamId: string }> = ({ teamId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RosterMemberFormData>({
    resolver: zodResolver(RosterMemberSchema),
    defaultValues: { role: "Jugador" },
  });

  const selectedRole = watch("role");

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/teams/${teamId}/roster`);
      setMembers(response.data);
    } catch (err: any) {
      setError("No se pudo cargar la plantilla del equipo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [teamId]);

  const onSubmit = async (data: RosterMemberFormData) => {
    setError(null);
    setSuccess(null);
    try {
      await apiClient.post(`/teams/${teamId}/roster`, data);
      setSuccess("Miembro agregado exitosamente a la plantilla.");
      reset();
      fetchRoster();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar el miembro.");
    }
  };

  const handleDelete = async (memberId: string) => {
    if (
      !window.confirm("¿Está seguro de remover este miembro de la plantilla?")
    )
      return;
    try {
      await apiClient.delete(`/teams/${teamId}/roster/${memberId}`);
      setSuccess("Miembro removido con éxito.");
      fetchRoster();
    } catch (err: any) {
      setError("Error al remover el miembro.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 font-medium text-slate-600">
        Cargando la plantilla del club...
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Listado de la Plantilla */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3 text-white">
          <Users className="text-emerald-400 w-5 h-5" />
          <h2 className="text-lg font-bold">Plantilla Oficial del Equipo</h2>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-4 py-3">Nombre / Email</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Rol / Cargo</th>
                <th className="px-4 py-3 text-center">Camiseta</th>
                <th className="px-4 py-3">Posición</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {members.map((member) => (
                <tr
                  key={member._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {member.name}
                    </div>
                    <div className="text-xs text-slate-400">{member.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{member.dni}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${member.role === "Delegado" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-600">
                    {member.jerseyNumber ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {member.position ?? "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario de Alta e Inscripción */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden h-fit">
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-2 text-white">
          <UserPlus className="text-emerald-400 w-5 h-5" />
          <h2 className="text-md font-bold">Inscribir Integrante</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
              {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Rol en la Plantilla
            </label>
            <select
              {...register("role")}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Jugador">Jugador</option>
              <option value="Delegado">Delegado / DT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                DNI / Cédula
              </label>
              <input
                type="text"
                {...register("dni")}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              {errors.dni && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dni.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {selectedRole === "Jugador" && (
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  N° de Camiseta
                </label>
                <input
                  type="number"
                  {...register("jerseyNumber")}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
                {errors.jerseyNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.jerseyNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Posición de Juego
                </label>
                <select
                  {...register("position")}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccione...</option>
                  <option value="Arquero">Arquero</option>
                  <option value="Defensor">Defensor</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                </select>
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.position.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold p-2.5 rounded-lg text-sm transition-colors mt-2 shadow"
          >
            Guardar en Plantilla
          </button>
        </form>
      </div>
    </div>
  );
};
