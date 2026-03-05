import React from 'react';

const UserManual: React.FC = () => {
    const sections = [
        {
            title: 'Paso 1: Carga y Validación',
            desc: 'Arrastra tu archivo .xlsx o .xlsm. El sistema verificará el nombre y la estructura automáticamente.',
            img: './docs/images/validador_home.png',
            alt: 'Pantalla de carga de archivos'
        },
        {
            title: 'Paso 2: Entender las Alertas',
            desc: 'Clasificamos los hallazgos en Errores (Críticos), Revisiones e Indicadores para tu gestión.',
            img: './docs/images/validador_severity_legend.png',
            alt: 'Leyenda de severidad'
        },
        {
            title: 'Paso 3: Detalle de Errores',
            desc: 'Haz clic en "Ver Detalle" para conocer la celda exacta y cómo corregir la inconsistencia.',
            img: './docs/images/validador_error_detail.png',
            alt: 'Panel de detalle de error'
        },
        {
            title: 'Paso 4: Exportación Final',
            desc: 'Descarga un reporte consolidado en Excel para facilitar el trabajo del equipo de estadística.',
            img: './docs/images/validador_export.png',
            alt: 'Opciones de exportación'
        }
    ];

    return (
        <section className="mt-24 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Guía Rápida de Uso
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Aprende a dominar el validador en pocos pasos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((section, i) => (
                    <div key={i} className="deis-card overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="p-6 pb-0">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                {section.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
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
                    </div>
                ))}
            </div>

            {/* Responsive Note Card */}
            <div className="deis-card p-8 flex flex-col md:flex-row items-center gap-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Acceso desde Cualquier Dispositivo
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        El validador es totalmente responsivo. Los directivos y equipos técnicos pueden validar
                        el estado de sus archivos desde cualquier smartphone, tablet o computador, facilitando
                        una supervisión ágil y oportuna.
                    </p>
                </div>
                <div className="w-full md:w-64 shrink-0 flex justify-center">
                    <img
                        src="./docs/images/validador_mobile_view.png"
                        alt="Vista en múltiples dispositivos del validador"
                        className="rounded-2xl shadow-lg border border-default max-h-[300px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default UserManual;
