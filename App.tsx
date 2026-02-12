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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      <TopBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        hasResults={hasResults}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">

        {/* Error State Display */}
        {state.error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200 animate-in fade-in slide-in-from-top-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error de Validación</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{state.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Validador REM 2026
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-slate-600">
                Herramienta oficial para la pre-validación de archivos REM antes de su carga en DEIS.
                Soporta validación de estructura, consistencia y reglas de negocio.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <FileDropzone onFileAccepted={handleFileAccepted} isProcessing={status === 'loading'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              {[
                {
                  title: 'Validación Automática',
                  desc: 'Verificación instantánea de reglas de negocio y consistencia.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  title: 'Reportes Detallados',
                  desc: 'Identificación precisa de errores con referencia a celdas y hojas.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                },
                {
                  title: 'Seguro y Privado',
                  desc: 'El procesamiento se realiza localmente en su navegador.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white/50 backdrop-blur p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS PAGE */}
        {currentPage === 'results' && state.file && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                ← Validar otro archivo
              </button>
              <div className="flex space-x-3">
                <ExportPanel
                  results={state.results}
                  metadata={state.metadata!}
                  establishment={state.establishment}
                />
              </div>
            </div>

            <RulesSummary
              findings={state.results}
              meta={state.metadata}
              establishment={state.establishment}
            />

            <FindingsTable
              findings={state.results}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />
          </div>
        )}
      </main>

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900">Validando Archivo...</h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              Analizando estructura y reglas de negocio. Esto puede tomar unos segundos.
            </p>
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
