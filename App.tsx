import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import TopBar from './components/TopBar';
import FileDropzone from './components/FileDropzone';
import RulesSummary from './components/RulesSummary';
import FindingsTable from './components/FindingsTable';
import { useValidationPipeline } from './hooks/useValidationPipeline';
import { ValidationResult } from './types';

// bundle-dynamic-imports: lazy-load components not needed on initial render
const FindingDrawer = lazy(() => import('./components/FindingDrawer'));
const ExportPanel = lazy(() => import('./components/ExportPanel'));

type Page = 'home' | 'results';
type AppStatus = 'idle' | 'loading' | 'success' | 'error';

// rendering-hoist-jsx: static feature cards array hoisted outside component
const FEATURES = [
  {
    title: 'Validación Automática',
    desc: 'Verificación instantánea de reglas de negocio y consistencia.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Reportes Detallados',
    desc: 'Identificación precisa de errores con referencia a celdas y hojas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: 'Seguro y Privado',
    desc: 'El procesamiento se realiza localmente en su navegador.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  }
] as const;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFinding, setSelectedFinding] = useState<ValidationResult | null>(null);

  const { state, validateFile, resetState } = useValidationPipeline();

  const status: AppStatus = state.isValidating
    ? 'loading'
    : state.error
      ? 'error'
      : state.file && !state.isValidating
        ? 'success'
        : 'idle';

  useEffect(() => {
    if (status === 'success') {
      setCurrentPage('results');
    }
  }, [status]);

  const handleFileAccepted = useCallback((file: File) => {
    validateFile(file);
  }, [validateFile]);

  const handleReset = useCallback(() => {
    resetState();
    setCurrentPage('home');
    setSelectedFinding(null);
  }, [resetState]);

  // rerender-memo: stable callbacks to avoid child re-renders
  const handleSelectFinding = useCallback((f: ValidationResult) => {
    setSelectedFinding(f);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedFinding(null);
  }, []);

  const hasResults = status === 'success';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <TopBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        hasResults={hasResults}
      />

      <main className="max-w-[980px] mx-auto px-4 sm:px-6 py-12 pb-24">

        {/* rendering-conditional-render: explicit ternary */}
        {state.error ? (
          <div className="mb-8 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{
              backgroundColor: 'var(--semantic-error-soft)',
              border: '1px solid var(--semantic-error-border)',
            }}>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--semantic-error)' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--semantic-error)' }}>Error de Validación</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{state.error}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* HOME PAGE — Apple-style hero */}
        {currentPage === 'home' ? (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="text-center space-y-4 pt-8">
              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Validador REM.
              </h1>
              <p className="max-w-lg mx-auto text-lg font-normal" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Pre-validación de archivos REM antes de su carga en DEIS.
                Estructura, consistencia y reglas de negocio.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <FileDropzone onFileAccepted={handleFileAccepted} isLoading={status === 'loading'} />
            </div>

            {/* rendering-hoist-jsx: uses hoisted FEATURES constant */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {FEATURES.map((feature, i) => (
                <div key={i} className="deis-card p-7 transition-all"
                  style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)' }}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* RESULTS PAGE — rendering-conditional-render: explicit ternary */}
        {currentPage === 'results' && state.file ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-sm font-medium transition-colors rounded-full px-3 py-1.5"
                style={{ color: 'var(--brand-accent)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,113,227,0.06)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Validar otro archivo
              </button>
              <div className="flex space-x-3">
                <Suspense fallback={null}>
                  <ExportPanel
                    results={state.results}
                    metadata={state.metadata!}
                    establishment={state.establishment}
                  />
                </Suspense>
              </div>
            </div>

            <RulesSummary
              findings={state.results}
              meta={state.metadata}
              establishment={state.establishment}
            />

            <FindingsTable
              findings={state.results}
              onSelectFinding={handleSelectFinding}
            />
          </div>
        ) : null}
      </main>

      {/* Loading overlay */}
      {status === 'loading' ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(20px)' }}>
          <div className="deis-card rounded-3xl p-10 flex flex-col items-center max-w-sm mx-4 animate-in zoom-in-95 duration-200" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="w-12 h-12 rounded-full animate-spin mb-5"
              style={{ border: '3px solid var(--border-default)', borderTopColor: 'var(--brand-accent)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Validando Archivo</h3>
            <p className="text-sm text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
              Analizando estructura y reglas de negocio.
            </p>
          </div>
        </div>
      ) : null}

      {/* bundle-dynamic-imports: lazy-loaded FindingDrawer */}
      <Suspense fallback={null}>
        <FindingDrawer
          finding={selectedFinding}
          onClose={handleCloseDrawer}
        />
      </Suspense>
    </div>
  );
};

export default App;
