import React, { Suspense, lazy } from 'react';

const ManualRuleExplorer = lazy(() => import('./ManualRuleExplorer'));

const setupChecklist = [
    {
        title: 'Nombre correcto del archivo',
        desc: 'Usa el formato CodigoEstablecimiento + Serie + Mes. Ejemplo: 123100A01.xlsm.'
    },
    {
        title: 'Hoja NOMBRE consistente',
        desc: 'El sistema valida version, mes, codigos y responsables antes de evaluar las reglas REM.'
    },
    {
        title: 'Reglas centralizadas',
        desc: 'Todas las validaciones nacen desde data/reglas_finales.json, sin archivos paralelos antiguos.'
    }
];

const journeySteps = [
    {
        step: '01',
        title: 'Cargar archivo REM',
        desc: 'Arrastra tu archivo .xlsx o .xlsm. El sistema revisa el nombre, extension y serie antes de procesarlo.',
        img: './docs/images/validador_home.png',
        alt: 'Pantalla de carga de archivos'
    },
    {
        step: '02',
        title: 'Validar hoja NOMBRE',
        desc: 'Se comprueba version, mes, codigos y responsables. Si la version es incorrecta, la alerta tiene prioridad.',
        img: './docs/images/validador_home.png',
        alt: 'Flujo de prevalidacion de hoja NOMBRE'
    },
    {
        step: '03',
        title: 'Aplicar reglas de negocio',
        desc: 'Las reglas comparan expresion_1 contra expresion_2. Si expresion_2 no trae dato, se interpreta como 0 o vacio.',
        img: './docs/images/validador_results.png',
        alt: 'Vista general de resultados de validacion'
    },
    {
        step: '04',
        title: 'Analizar hallazgos',
        desc: 'Revisa severidad, hoja, celda, comparacion evaluada y evidencia para corregir solo lo necesario.',
        img: './docs/images/validador_error_detail.png',
        alt: 'Panel de detalle de hallazgo'
    },
    {
        step: '05',
        title: 'Exportar y volver a validar',
        desc: 'Descarga el reporte Excel, corrige tu REM original y vuelve a ejecutar la validacion hasta cerrar las brechas.',
        img: './docs/images/validador_export.png',
        alt: 'Opciones de exportacion'
    }
];

const severityGuide = [
    {
        title: 'ERROR',
        tone: 'var(--semantic-error)',
        bg: 'var(--semantic-error-soft)',
        desc: 'Inconsistencia critica. Debe corregirse antes del envio.'
    },
    {
        title: 'REVISAR',
        tone: 'var(--semantic-warning)',
        bg: 'var(--semantic-warning-soft)',
        desc: 'Caso atipico o sensible. Requiere validacion humana.'
    },
    {
        title: 'INDICADOR',
        tone: 'var(--semantic-info)',
        bg: 'var(--semantic-info-soft)',
        desc: 'Senal de calidad o gestion. No siempre bloquea el flujo.'
    }
];

const reviewAreas = [
    {
        title: 'Resumen del archivo',
        desc: 'Confirma establecimiento, serie, mes, hojas procesadas y tasa de aprobacion antes de profundizar.'
    },
    {
        title: 'Detalle del hallazgo',
        desc: 'Usa el panel lateral para ver celda, valor encontrado, referencia y comparacion evaluada.'
    },
    {
        title: 'Vista Celdas',
        desc: 'Cruza celdas del libro con el catalogo para detectar hojas faltantes, celdas vacias o referencias invalidas.'
    }
];

const UserManual: React.FC = () => {
    return (
        <section className="mt-24 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Manual visual de uso
                </h2>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Esta guia resume el flujo real del sistema: validar nombre, revisar hoja NOMBRE, aplicar reglas REM y
                    corregir con evidencia clara antes de exportar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {setupChecklist.map((item) => (
                    <div key={item.title} className="deis-card p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold mb-4"
                            style={{ backgroundColor: 'var(--control-bg)', color: 'var(--brand-accent)' }}>
                            Antes de comenzar
                        </div>
                        <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="deis-card p-6 md:p-8 space-y-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Como piensa el validador
                    </h3>
                    <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                        Cada validacion se interpreta como una comparacion entre un numerador y un denominador. En la practica,
                        <strong style={{ color: 'var(--text-primary)' }}> expresion_1 </strong>
                        es el valor que se quiere controlar y
                        <strong style={{ color: 'var(--text-primary)' }}> expresion_2 </strong>
                        es la referencia contra la que se compara.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                    <div className="rounded-3xl p-5 border border-default" style={{ backgroundColor: 'var(--control-bg)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Numerador
                                </p>
                                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    <code>expresion_1</code>
                                </p>
                                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                                    Celda, rango o suma que representa el valor actual del REM.
                                </p>
                            </div>
                            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Denominador
                                </p>
                                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    <code>expresion_2</code>
                                </p>
                                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                                    Referencia esperada. Si no trae datos, el sistema la trata como 0 o vacio.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, rgba(0,113,227,0.10), rgba(37,99,235,0.04))', border: '1px solid var(--border-default)' }}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--brand-accent)' }}>
                            Regla mental rapida
                        </p>
                        <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <p>1. Identifica el dato observado en <code>expresion_1</code>.</p>
                            <p>2. Busca la referencia en <code>expresion_2</code>.</p>
                            <p>3. Si no existe referencia, compara contra <code>0</code> o vacio.</p>
                            <p>4. Interpreta el resultado usando severidad, comparacion y evidencia.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Ruta de validacion
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            El sistema sigue este recorrido de principio a fin en cada archivo.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {journeySteps.map((section) => (
                        <article key={section.step} className="deis-card overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <div className="p-6 pb-4">
                                <div className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold mb-4"
                                    style={{ backgroundColor: 'var(--control-bg)', color: 'var(--brand-accent)' }}>
                                    Paso {section.step}
                                </div>
                                <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    {section.title}
                                </h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {section.desc}
                                </p>
                            </div>
                            <div className="mt-auto bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-default">
                                <img
                                    src={section.img}
                                    alt={section.alt}
                                    className="rounded-xl shadow-sm border border-default mx-auto object-cover w-full h-auto max-h-[240px]"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {severityGuide.map((item) => (
                    <div key={item.title} className="deis-card p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold mb-4"
                            style={{ backgroundColor: item.bg, color: item.tone }}>
                            {item.title}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="deis-card p-6 md:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Donde mirar cuando algo falla
                    </h3>
                    <div className="space-y-4">
                        {reviewAreas.map((area) => (
                            <div key={area.title} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--control-bg)' }}>
                                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {area.title}
                                </h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {area.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="deis-card p-6 md:p-8 flex flex-col justify-between gap-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div>
                        <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                            Acceso desde cualquier dispositivo
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            El flujo de carga, resultados y revision de hallazgos esta optimizado para escritorio y movil, lo que facilita la supervision clinica y estadistica.
                        </p>
                    </div>
                    <div className="w-full flex justify-center">
                        <img
                            src="./docs/images/validador_mobile_view.png"
                            alt="Vista movil del validador"
                            className="rounded-2xl shadow-lg border border-default max-h-[320px]"
                        />
                    </div>
                </div>
            </div>

            <Suspense
                fallback={
                    <div className="deis-card p-6 md:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Cargando explorador de validaciones...
                        </p>
                    </div>
                }
            >
                <ManualRuleExplorer />
            </Suspense>
        </section>
    );
};

export default UserManual;
