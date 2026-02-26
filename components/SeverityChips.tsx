import React from 'react';
import { Severity } from '../types';

interface SeverityChipProps {
    severity: Severity;
    count?: number;
    active?: boolean;
    onClick?: () => void;
}

const SEVERITY_STYLES: Record<Severity, { color: string; softBg: string; borderColor: string; dot: string }> = {
    [Severity.ERROR]: {
        color: 'var(--semantic-error)',
        softBg: 'var(--semantic-error-soft)',
        borderColor: 'var(--semantic-error-border)',
        dot: 'var(--semantic-error)',
    },
    [Severity.REVISAR]: {
        color: 'var(--semantic-warning)',
        softBg: 'var(--semantic-warning-soft)',
        borderColor: 'var(--semantic-warning-border)',
        dot: 'var(--semantic-warning)',
    },
    [Severity.OBSERVAR]: {
        color: 'var(--semantic-success)',
        softBg: 'var(--semantic-success-soft)',
        borderColor: 'var(--semantic-success-border)',
        dot: 'var(--semantic-success)',
    },
    [Severity.INDICADOR]: {
        color: 'var(--semantic-info)',
        softBg: 'var(--semantic-info-soft)',
        borderColor: 'var(--semantic-info-border)',
        dot: 'var(--semantic-info)',
    },
};

export const SeverityChip: React.FC<SeverityChipProps> = ({ severity, count, active, onClick }) => {
    const s = SEVERITY_STYLES[severity];

    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
            style={
                active
                    ? {
                        backgroundColor: s.color,
                        color: 'white',
                        border: '1px solid transparent',
                        boxShadow: 'var(--shadow-sm)',
                    }
                    : {
                        backgroundColor: s.softBg,
                        color: s.color,
                        border: `1px solid ${s.borderColor}`,
                    }
            }
        >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? 'rgba(255,255,255,0.6)' : s.dot }} />
            {severity}
            {count !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-black"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)' }}>
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
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide"
            style={{
                backgroundColor: s.softBg,
                color: s.color,
                border: `1px solid ${s.borderColor}`,
            }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
            {severity}
        </span>
    );
};

export default SeverityChip;
