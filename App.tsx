import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import TopBar from './components/TopBar';
import FileDropzone from './components/FileDropzone';
import RulesSummary from './components/RulesSummary';
import FindingsTable from './components/FindingsTable';
import UserManual from './components/UserManual';
import { useValidationPipeline } from './hooks/useValidationPipeline';
import { ValidationResult } from './types';

// bundle-dynamic-imports: lazy-load components not needed on initial render
const FindingDrawer = lazy(() => import('./components/FindingDrawer'));
const ExportPanel = lazy(() => import('./components/ExportPanel'));

type Page = 'home' | 'results';
type AppStatus = 'idle' | 'loading' | 'success' | 'error';

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">

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


            <UserManual />
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
            </div>

            {/* VERSION ERROR ALERT — Priority banner */}
            {state.versionError ? (
              <div className="rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{
                  backgroundColor: 'var(--semantic-error-soft)',
                  border: '1px solid var(--semantic-error-border)',
                }}>
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 shrink-0 mt-0.5" style={{ color: 'var(--semantic-error)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--semantic-error)' }}>⚠ Error de Versión de Archivo</h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{state.versionError}</p>
                    <p className="mt-2 text-xs font-medium" style={{ color: 'var(--semantic-error)' }}>Esta alerta tiene prioridad. Verifique la versión del archivo antes de continuar.</p>
                  </div>
                </div>
              </div>
            ) : null}

            <RulesSummary
              findings={state.results}
              meta={state.metadata}
              establishment={state.establishment}
            />

            {/* Export button — between cards and table */}
            <div className="flex justify-end">
              <Suspense fallback={null}>
                <ExportPanel
                  results={state.results}
                  metadata={state.metadata!}
                  establishment={state.establishment}
                />
              </Suspense>
            </div>

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

      {/* Version Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 px-4 text-center" style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-default)',
        zIndex: 10
      }}>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Validador DEIS SSO — v{__APP_VERSION__} · Build {__BUILD_DATE__}
        </span>
      </footer>
    </div>
  );
};

export default App;
