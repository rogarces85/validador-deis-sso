import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import FileDropzone from './components/FileDropzone';
import RulesSummary from './components/RulesSummary';
import FindingsTable from './components/FindingsTable';
import FindingDrawer from './components/FindingDrawer';
import ExportPanel from './components/ExportPanel';
import { useValidationPipeline } from './hooks/useValidationPipeline';
import { ValidationResult } from './types';

type Page = 'home' | 'results';
type AppStatus = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFinding, setSelectedFinding] = useState<ValidationResult | null>(null);

  const { state, validateFile, resetState } = useValidationPipeline();

  // Derive status from hook state
  const status: AppStatus = state.isValidating
    ? 'loading'
    : state.error
      ? 'error'
      : state.file && !state.isValidating
        ? 'success'
        : 'idle';

  // Side effect to switch page on success
  useEffect(() => {
    if (status === 'success') {
      setCurrentPage('results');
    }
  }, [status]);

  const handleFileAccepted = (file: File) => {
    validateFile(file);
  };

  const handleReset = () => {
    resetState();
    setCurrentPage('home');
    setSelectedFinding(null);
  };

  const hasResults = status === 'success';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TopBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        hasResults={hasResults}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* ===== HOME PAGE ===== */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero */}
            {status !== 'error' && (
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-4 border border-blue-100">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  Motor de Validación v1.0
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                  Validación de calidad<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    REM 2026
                  </span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Sube tus archivos de Resumen Estadístico Mensual para una verificación automatizada
                  contra el motor de reglas DEIS del Servicio de Salud Osorno.
                </p>
              </div>
            )}

            {/* Error state */}
            {status === 'error' && (
              <div className="max-w-xl mx-auto mb-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white border border-red-200 p-8 rounded-2xl text-center shadow-xl shadow-red-50">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Error de Procesamiento</h3>
                  <p className="text-slate-500 mb-6">{state.error}</p>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg inline-flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Intentar Nuevamente
                  </button>
                </div>
              </div>
            )}

            {/* Dropzone */}
            <FileDropzone
              onFileAccepted={handleFileAccepted}
              isLoading={status === 'loading'}
            />

            {/* Features section */}
            {status === 'idle' && (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Validación Automática',
                    desc: 'Motor de reglas configurable que verifica estructura, cruces y consistencia de datos.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Reporte Detallado',
                    desc: 'Visualiza hallazgos por severidad con filtros avanzados y evidencia contextual.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Exportación Múltiple',
                    desc: 'Descarga tus resultados en JSON, CSV o copia el resumen al portapapeles.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    ),
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {feat.icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== RESULTS PAGE ===== */}
        {currentPage === 'results' && hasResults && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Back button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cargar otro archivo
            </button>

            {/* Summary */}
            <RulesSummary
              findings={state.results}
              meta={state.metadata}
              establishment={state.establishment}
            />

            {/* Findings Table */}
            <FindingsTable
              findings={state.results}
              onSelectFinding={setSelectedFinding}
            />

            {/* Export Panel */}
            <ExportPanel
              findings={state.results}
              meta={state.metadata}
              establishment={state.establishment}
            />
          </div>
        )}
      </main>

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Procesando</h3>
            <p className="text-slate-500">Validando estructura y aplicando reglas...</p>
            <div className="mt-6 flex gap-1.5 justify-center">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finding Drawer */}
      <FindingDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />


    </div>
  );
};

export default App;
