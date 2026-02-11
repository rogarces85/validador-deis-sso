import React from 'react';

type Page = 'home' | 'results';

interface TopBarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    hasResults: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ currentPage, onNavigate, hasResults }) => {
    const navItems: { key: Page; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
        {
            key: 'home',
            label: 'Cargar Archivo',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
        },
        {
            key: 'results',
            label: 'Resultados',
            disabled: !hasResults,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                                Validador REM
                            </h1>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                                DEIS · SSO · 2026
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden sm:flex items-center gap-1 bg-slate-100/80 rounded-xl p-1">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => !item.disabled && onNavigate(item.key)}
                                disabled={item.disabled}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${currentPage === item.key
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : item.disabled
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Status pill */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-slate-500">Motor v1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
