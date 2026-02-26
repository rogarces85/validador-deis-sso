import React, { useMemo } from 'react';
import { useTheme } from './ThemeContext';

type Page = 'home' | 'results';

interface TopBarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    hasResults: boolean;
}

// rendering-hoist-jsx: static SVG icons hoisted outside component
const ICON_UPLOAD = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const ICON_RESULTS = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ICON_MOON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ICON_SUN = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const TopBar: React.FC<TopBarProps> = ({ currentPage, onNavigate, hasResults }) => {
    const { theme, toggleTheme } = useTheme();

    // rerender-memo: memoize navItems based on hasResults (only dependency that changes)
    const navItems = useMemo(() => [
        { key: 'home' as Page, label: 'Cargar Archivo', icon: ICON_UPLOAD, disabled: false },
        { key: 'results' as Page, label: 'Resultados', icon: ICON_RESULTS, disabled: !hasResults },
    ], [hasResults]);

    return (
        <header className="sticky top-0 z-50" style={{
            backgroundColor: theme === 'dark' ? 'rgba(15, 25, 35, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-default)',
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src="/logo-deis.png"
                                alt="DEIS Osorno"
                                className="h-9 w-9 rounded-lg object-contain"
                                style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'transparent', padding: '2px' }}
                            />
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                style={{
                                    backgroundColor: 'var(--semantic-success)',
                                    borderColor: theme === 'dark' ? 'rgba(15, 25, 35, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                                }} />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                                Validador REM
                            </h1>
                            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-ocean)' }}>
                                DEIS · SSO · 2026
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden sm:flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: 'var(--bg-inset)' }}>
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => !item.disabled && onNavigate(item.key)}
                                disabled={item.disabled}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                                style={
                                    currentPage === item.key
                                        ? {
                                            backgroundColor: 'var(--bg-surface)',
                                            color: 'var(--brand-ocean)',
                                            boxShadow: 'var(--shadow-sm)',
                                        }
                                        : item.disabled
                                            ? { color: 'var(--text-muted)', cursor: 'not-allowed' }
                                            : { color: 'var(--text-secondary)' }
                                }
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right side: theme toggle + status */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                            title={`Modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                        >
                            {/* rendering-conditional-render: explicit ternary */}
                            {theme === 'light' ? ICON_MOON : ICON_SUN}
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{
                                backgroundColor: 'var(--bg-inset)',
                                border: '1px solid var(--border-default)',
                            }}>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--semantic-success)' }} />
                            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Motor v1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
