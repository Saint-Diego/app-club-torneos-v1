import React from "react";
import { Shield, Mail, Globe, Copyright } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-6 mt-auto relative z-10 w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Isologotipo e Identidad */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Shield className="text-emerald-400 w-4 h-4" />
          <span>LigaPro Manager</span>
        </div>

        {/* Información de Copyright Ininterrumpida */}
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <Copyright className="w-3.5 h-3.5" />
          <span>
            {currentYear} Ecosistema Técnico de Gestión Deportiva. Todos los
            derechos reservados.
          </span>
        </div>

        {/* Canales Oficiales de Soporte / Enlaces */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <a
            href="mailto:soporte@ligapro.com"
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Soporte</span>
          </a>
          <a
            href="https://ligapro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Portal Oficial</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
