
import React, { useState } from 'react';
import { ValidationResult, Severity } from '../types';

interface RuleResultsProps {
  results: ValidationResult[];
}

const RuleResults: React.FC<RuleResultsProps> = ({ results }) => {
  const [filter, setFilter] = useState<Severity | 'ALL'>('ALL');

  const filteredResults = filter === 'ALL' 
    ? results 
    : results.filter(r => r.severidad === filter);

  const getSeverityColors = (severity: Severity) => {
    switch (severity) {
      case Severity.ERROR: 
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800', 
          border: 'border-red-200',
          status: 'text-red-600'
        };
      case Severity.REVISAR: 
        return { 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-800', 
          border: 'border-yellow-200',
          status: 'text-yellow-600'
        };
      case Severity.OBSERVAR: 
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800', 
          border: 'border-green-200',
          status: 'text-green-600'
        };
      case Severity.INDICADOR: 
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800', 
          border: 'border-blue-200',
          status: 'text-blue-600'
        };
      default: 
        return { 
          bg: 'bg-slate-100', 
          text: 'text-slate-800', 
          border: 'border-slate-200',
          status: 'text-slate-600'
        };
    }
  };

  const stats = {
    total: results.length,
    errors: results.filter(r => r.severidad === Severity.ERROR && !r.resultado).length,
    passed: results.filter(r => r.resultado).length
  };

  const formatActualValue = (val: any) => {
    if (val === null || val === undefined || val === '') return <span className="text-slate-300 italic">(Vacío)</span>;
    if (typeof val === 'number') return val.toLocaleString();
    return String(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Total Reglas</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Exitosas</p>
          <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Errores Críticos</p>
          <p className="text-3xl font-bold text-red-600">{stats.errors}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900">Detalle de Validaciones</h3>
          <div className="flex flex-wrap gap-2">
            {(['ALL', ...Object.values(Severity)] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === s 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 'ALL' ? 'TODAS' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Descripción / Regla</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Severidad</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Valor Actual</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Esperado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((res, i) => {
                const colors = getSeverityColors(res.severidad);
                return (
                  <tr key={res.ruleId + i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {res.resultado ? (
                        <span className="flex items-center gap-2 text-green-600 font-bold text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          OK
                        </span>
                      ) : (
                        <span className={`flex items-center gap-2 font-bold text-sm ${colors.status}`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          FALLA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{res.descripcion}</p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{res.ruleId}</p>
                      {res.mensaje && <p className="text-xs text-red-500 mt-1 italic">{res.mensaje}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {res.severidad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-700 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {formatActualValue(res.valorActual)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-400">
                        {res.valorEsperado}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No se encontraron validaciones con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RuleResults;
