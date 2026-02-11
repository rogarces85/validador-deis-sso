
import React from 'react';
import { FileMetadata, Establishment } from '../types';
import { MONTH_NAMES } from '../constants';

interface ResultCardProps {
  metadata: FileMetadata;
  establishment: Establishment | null;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ metadata, establishment, onReset }) => {
  const monthName = MONTH_NAMES[parseInt(metadata.mes) - 1] || metadata.mes;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex gap-6 items-center">
          <div className="bg-slate-100 p-4 rounded-xl text-slate-500 shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{metadata.nombreOriginal}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase tracking-wide">Serie {metadata.serieRem}</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wide">{monthName}</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wide">DEIS: {metadata.codigoEstablecimiento}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-4">
           {establishment ? (
             <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                </div>
                <div>
                   <p className="text-xs font-semibold text-green-600 uppercase">Establecimiento Identificado</p>
                   <p className="text-slate-900 font-bold">{establishment.nombre}</p>
                   <p className="text-xs text-slate-500">{establishment.tipo}</p>
                </div>
             </div>
           ) : (
             <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                </div>
                <div>
                   <p className="text-xs font-semibold text-red-600 uppercase">Error de Identificación</p>
                   <p className="text-slate-900 font-bold">Código no registrado</p>
                </div>
             </div>
           )}
           <button 
             onClick={onReset}
             className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors"
           >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Cargar otro archivo
           </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
