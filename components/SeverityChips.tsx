import React from 'react';
import { Severity } from '../types';

interface SeverityChipProps {
    severity: Severity;
    count?: number;
    active?: boolean;
    onClick?: () => void;
}

const SEVERITY_STYLES: Record<Severity, { color: string; softBg: string; dot: string }> = {
    [Severity.ERROR]: {
        color: 'var(--semantic-error)',
        softBg: 'var(--semantic-error-soft)',
        dot: 'var(--semantic-error)',
    },
    [Severity.REVISAR]: {
        color: 'var(--semantic-warning)',
        softBg: 'var(--semantic-warning-soft)',
        dot: 'var(--semantic-warning)',
    },
    [Severity.INDICADOR]: {
        color: 'var(--semantic-info)',
        softBg: 'var(--semantic-info-soft)',
        dot: 'var(--semantic-info)',
    },
};

export const SeverityChip: React.FC<SeverityChipProps> = ({ severity, count, active, onClick }) => {
    const s = SEVERITY_STYLES[severity];

    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={
                active
                    ? {
                        backgroundColor: s.color,
                        color: 'white',
                    }
                    : {
                        backgroundColor: s.softBg,
                        color: s.color,
                    }
            }
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? 'rgba(255,255,255,0.6)' : s.dot }} />
            {severity}
            {count !== undefined && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)' }}>
                    {count}
                </span>
            )}
        </button>
    );
};

// Inline badge (non-interactive) — minimal Apple-style
export const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
    const s = SEVERITY_STYLES[severity];
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
            style={{
                backgroundColor: s.softBg,
                color: s.color,
            }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
            {severity}
        </span>
    );
};

export default SeverityChip;
