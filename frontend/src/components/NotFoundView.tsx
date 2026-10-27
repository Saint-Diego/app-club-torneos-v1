import React from "react";

export const NotFoundView: React.FC = () => (
  <div className="p-12 text-center bg-white rounded-2xl shadow border border-slate-200 max-w-lg mx-auto mt-10">
    <h2 className="text-blue-600 font-black text-2xl uppercase tracking-wide">
      404 - Página No Encontrada
    </h2>
    <p className="text-slate-500 text-sm mt-2 font-medium">
      La página que estás buscando no existe o ha sido movida.
    </p>
  </div>
);
