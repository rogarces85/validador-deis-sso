import React from 'react';
import { Severity } from '../types';

interface SeverityChipProps {
    severity: Severity;
    count?: number;
    active?: boolean;
    onClick?: () => void;
}

const SEVERITY_STYLES: Record<Severity, { bg: string; activeBg: string; text: string; border: string; dot: string }> = {
    [Severity.ERROR]: {
        bg: 'bg-red-50',
        activeBg: 'bg-red-600 text-white',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
    [Severity.REVISAR]: {
        bg: 'bg-amber-50',
        activeBg: 'bg-amber-500 text-white',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
    [Severity.OBSERVAR]: {
        bg: 'bg-emerald-50',
        activeBg: 'bg-emerald-600 text-white',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },
    [Severity.INDICADOR]: {
        bg: 'bg-blue-50',
        activeBg: 'bg-blue-600 text-white',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
    },
};

export const SeverityChip: React.FC<SeverityChipProps> = ({ severity, count, active, onClick }) => {
    const s = SEVERITY_STYLES[severity];

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${active
                    ? `${s.activeBg} border-transparent shadow-sm`
                    : `${s.bg} ${s.text} ${s.border} hover:opacity-80`
                }`}
        >
            <span className={`w-2 h-2 rounded-full ${active ? 'bg-white/60' : s.dot}`} />
            {severity}
            {count !== undefined && (
                <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-black ${active ? 'bg-white/20' : 'bg-black/5'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
};

// Inline badge (non-interactive)
export const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
    const s = SEVERITY_STYLES[severity];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${s.bg} ${s.text} border ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {severity}
        </span>
    );
};

export default SeverityChip;
