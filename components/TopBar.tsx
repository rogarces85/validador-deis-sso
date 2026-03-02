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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const ICON_RESULTS = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ICON_MOON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ICON_SUN = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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
            backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(245, 245, 247, 0.72)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}>
            <div className="max-w-[980px] mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-12">
                    {/* Brand — compact Apple style */}
                    <div className="flex items-center gap-2.5">
                        <img
                            src={`${import.meta.env.BASE_URL}logo-deis.png`}
                            alt="DEIS Osorno"
                            className="h-7 w-7 rounded-lg object-contain"
                            style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'transparent', padding: '1px' }}
                        />
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                Validador REM
                            </span>
                            <span className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>
                                DEIS · 2026
                            </span>
                        </div>
                    </div>

                    {/* Navigation — minimal pill tabs */}
                    <nav className="hidden sm:flex items-center gap-1">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => !item.disabled && onNavigate(item.key)}
                                disabled={item.disabled}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                                style={
                                    currentPage === item.key
                                        ? {
                                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
                                            color: 'var(--text-primary)',
                                        }
                                        : item.disabled
                                            ? { color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.5 }
                                            : { color: 'var(--text-secondary)' }
                                }
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right side: theme toggle */}
                    <div className="flex items-center">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                            title={`Modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
                        >
                            {/* rendering-conditional-render: explicit ternary */}
                            {theme === 'light' ? ICON_MOON : ICON_SUN}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
