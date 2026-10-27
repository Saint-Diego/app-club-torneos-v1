import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/api/apiClient";
import { MapPin, Plus, Trash2, Save, AlertCircle } from "lucide-react";

const VenueFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(5, "La dirección es obligatoria"),
  courts: z
    .array(
      z.object({
        name: z.string().min(2, "Nombre de cancha requerido"),
        type: z.enum(["Fútbol 11", "Fútbol 7", "Futsal"]),
        hasLighting: z.boolean(),
      }),
    )
    .min(1, "Debe registrar al menos una cancha"),
});

type VenueFormData = z.infer<typeof VenueFormSchema>;

export const CreateVenueForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormData>({
    resolver: zodResolver(VenueFormSchema),
    defaultValues: {
      courts: [
        { name: "Cancha Principal", type: "Fútbol 11", hasLighting: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "courts" });

  const onSubmit = async (data: VenueFormData) => {
    setError(null);
    setSuccess(null);
    try {
      await apiClient.post("/venues", data);
      setSuccess("Sede deportiva e infraestructura registradas correctamente.");
      reset();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al guardar la sede.",
      );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center gap-2">
        <MapPin className="text-emerald-400 w-5 h-5" />
        <h3 className="font-bold">Registrar Nueva Sede Compleja</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Nombre Comercial de la Sede
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Complejo Deportivo Norte"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Dirección / Ubicación Física
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Av. del Deporte 4500"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* Gestión Dinámica de Sub-Canchas */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Canchas Incluidas
            </h4>
            <button
              type="button"
              onClick={() =>
                append({ name: "", type: "Fútbol 11", hasLighting: false })
              }
              className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Añadir Cancha
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200 animate-fadeIn"
            >
              <div className="sm:col-span-5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Identificador de Cancha
                </label>
                <input
                  type="text"
                  {...register(`courts.${index}.name` as const)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                  placeholder="Ej: Cancha 2 Sintética"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Modalidad
                </label>
                <select
                  {...register(`courts.${index}.type` as const)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                >
                  <option value="Fútbol 11">Fútbol 11</option>
                  <option value="Fútbol 7">Fútbol 7</option>
                  <option value="Futsal">Futsal</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex items-center justify-center pb-2.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    {...register(`courts.${index}.hasLighting` as const)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Luz</span>
                </label>
              </div>
              <div className="sm:col-span-1 text-center pb-1">
                <button
                  type="button"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 disabled:opacity-30 p-1"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
          {errors.courts && (
            <p className="text-red-500 text-xs">{errors.courts.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Guardando..." : "Dar de Alta Sede"}
        </button>
      </form>
    </div>
  );
};
