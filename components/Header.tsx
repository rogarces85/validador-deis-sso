
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Validador DEIS SSO 2026</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Servicio de Salud Osorno</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-all">Inicio</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-all">Historial</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-all">Configuración</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
