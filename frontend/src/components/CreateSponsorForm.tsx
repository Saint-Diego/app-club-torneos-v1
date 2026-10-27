import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/api/apiClient";
import { Award, DollarSign } from "lucide-react";

const SponsorFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre comercial es obligatorio"),
  logoUrl: z.union([
    z.string().trim().url("Debe ser una URL de imagen válida"),
    z.literal(""),
  ]),
  contributionAmount: z.coerce
    .number({ invalid_type_error: "El monto es obligatorio" })
    .min(0, "El monto no puede ser negativo"),
});

type SponsorFormData = z.infer<typeof SponsorFormSchema>;

export const CreateSponsorForm: React.FC = () => {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SponsorFormData>({
    resolver: zodResolver(SponsorFormSchema),
    defaultValues: { name: "", logoUrl: "", contributionAmount: 0 },
  });

  const onSubmit = async (data: SponsorFormData) => {
    setStatus(null);
    try {
      await apiClient.post("/sponsors", {
        ...data,
        logoUrl: data.logoUrl || undefined,
      });
      setStatus({
        type: "success",
        msg: "Patrocinador comercial indexado correctamente.",
      });
      reset();
    } catch (err: unknown) {
      setStatus({
        type: "error",
        msg: err instanceof Error ? err.message : "Error de procesamiento.",
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md mx-auto overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center gap-2">
        <Award className="text-emerald-400 w-5 h-5" />
        <h3 className="font-bold">Nuevo Patrocinador Corporativo</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {status && (
          <div
            className={`p-3 rounded-lg text-xs font-bold ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
          >
            {status.msg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Nombre de la Marca
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
            placeholder="Ej: Nike Global"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            URL del Logotipo
          </label>
          <input
            type="text"
            {...register("logoUrl")}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
            placeholder="https://mi-imagen.com"
          />
          {errors.logoUrl && (
            <p className="text-red-500 text-xs mt-1">
              {errors.logoUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Monto de Aportación Económica
          </label>
          <div className="relative">
            <input
              type="number"
              {...register("contributionAmount")}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 pl-7 text-sm font-mono"
            />
            <DollarSign className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          {errors.contributionAmount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contributionAmount.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold p-2.5 rounded-lg text-sm shadow transition-colors"
        >
          {isSubmitting ? "Registrando..." : "Vincular Patrocinador"}
        </button>
      </form>
    </div>
  );
};
