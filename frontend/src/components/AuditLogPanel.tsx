import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { ShieldAlert, User, Terminal } from "lucide-react";

interface SystemLog {
  _id: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  createdAt: string;
  ipAddress?: string;
}

export const AuditLogPanel: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const loading = loadedPage !== page;

  useEffect(() => {
    let isCurrentRequest = true;

    apiClient
      .get(`/audit-logs?page=${page}&limit=20`)
      .then((res) => {
        if (!isCurrentRequest) return;

        setLogs(res.data.logs);
        setTotalPages(res.data.pagination.pages);
      })
      .catch((err: unknown) => {
        if (isCurrentRequest) {
          console.error("Error cargando bitácora de seguridad:", err);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setLoadedPage(page);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  if (loading && page === 1)
    return (
      <div className="text-center py-8 text-slate-500 font-medium">
        Leyendo registros inmutables de seguridad...
      </div>
    );

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-400 w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">
              Bitácora de Auditoría del Sistema
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Registro inmutable de control de accesos y modificaciones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-md text-xs font-mono text-slate-300">
          <Terminal className="w-3.5 h-3.5" />
          <span>LOGS OK</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
              <th className="py-2.5 px-4">Fecha</th>
              <th className="py-2.5 px-4">Usuario</th>
              <th className="py-2.5 px-4">Rol</th>
              <th className="py-2.5 px-4">Acción Efectuada</th>
              <th className="py-2.5 px-4">Recurso</th>
              <th className="py-2.5 px-4 text-right">Origen IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {logs.map((log) => (
              <tr
                key={log._id}
                className="hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-500" />
                  {log.userEmail}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.userRole === "Admin" ? "bg-red-950 text-red-400 border border-red-900" : "bg-slate-800 text-slate-300"}`}
                  >
                    {log.userRole}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-emerald-400">
                  {log.action}
                </td>
                <td className="py-3 px-4 text-slate-300 font-medium">
                  {log.resource}
                </td>
                <td className="py-3 px-4 text-right text-slate-500">
                  {log.ipAddress || "Interno"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded disabled:opacity-40 transition-colors text-xs font-semibold"
          >
            Anterior
          </button>
          <span className="text-xs text-slate-400">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded disabled:opacity-40 transition-colors text-xs font-semibold"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
