import React from "react";

export const UnauthorizedView: React.FC = () => (
  <div className="p-12 text-center bg-white rounded-2xl shadow border border-slate-200 max-w-md mx-auto mt-10">
    <h2 className="text-red-600 font-black text-2xl uppercase tracking-wide">
      403 - Acceso Denegado
    </h2>
    <p className="text-slate-500 text-sm mt-2 font-medium">
      Tu rol de usuario actual no posee permisos para visualizar esta sección.
    </p>
  </div>
);
