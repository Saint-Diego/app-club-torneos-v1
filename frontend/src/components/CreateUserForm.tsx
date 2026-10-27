import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/api/apiClient";
import { UserPlus, UserCheck } from "lucide-react";

interface ErrorBackend {
  message: string;
}

interface AlertMessage {
  info: string;
  isError: boolean;
}

const UserFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email institucional inválido"),
  password: z
    .string()
    .min(6, "La contraseña de seguridad requiere mínimo 6 caracteres"),
  role: z.enum(["Admin", "Organizador", "Delegado", "Jugador"]),
});

type UserFormData = z.infer<typeof UserFormSchema>;

export const CreateUserForm: React.FC = () => {
  const [feedback, setFeedback] = useState<AlertMessage | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const resp = await apiClient.post("/auth/register", data);
      setFeedback({ info: resp.data.message, isError: false });
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const { response } = err as AxiosError<ErrorBackend>;
        setFeedback({
          info: response?.data.message ?? "Error al crear el usuario",
          isError: true,
        });
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md mx-auto overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center gap-2">
        <UserPlus className="text-emerald-400 w-5 h-5" />
        <h3 className="font-bold">Alta de Credenciales de Usuario (RBAC)</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {feedback && (
          <div
            className={`p-3 text-xs font-bold border rounded-lg ${feedback.isError ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
          >
            {feedback.info}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Nombre y Apellido
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Correo Electrónico Oficial
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Clave de Acceso Inicial
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Rol Operativo Asignado
          </label>
          <select
            {...register("role")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
          >
            <option value="Jugador">Jugador</option>
            <option value="Delegado">Delegado de Club</option>
            <option value="Organizador">Organizador de Liga</option>
            <option value="Admin">Administrador General</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-emerald-400 font-bold p-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow"
        >
          <UserCheck className="w-4 h-4" /> Confirmar Perfil
        </button>
      </form>
    </div>
  );
};
