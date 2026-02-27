import React, { useState, useCallback, useRef } from 'react';
import { useTheme } from './ThemeContext';

interface FileDropzoneProps {
    onFileAccepted: (file: File) => void;
    isLoading: boolean;
}

const FILE_PATTERN = /^(\d{6})([A-Z0-9]{1})(\d{2})\.(xlsx|xlsm)$/i;

// rendering-hoist-jsx: static array hoisted outside component
const FEATURE_BADGES = ['Validación de Nombre', 'Cruces de Información', 'Reporte Automático'] as const;

type FileNameStatus = 'idle' | 'valid' | 'invalid';

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileAccepted, isLoading }) => {
    const { theme } = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [nameStatus, setNameStatus] = useState<FileNameStatus>('idle');
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndSet = useCallback((file: File) => {
        setSelectedFile(file);
        const valid = FILE_PATTERN.test(file.name);
        setNameStatus(valid ? 'valid' : 'invalid');
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) validateAndSet(file);
    }, [validateAndSet]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) validateAndSet(file);
        },
        [validateAndSet]
    );

    const handleUpload = () => {
        if (selectedFile) {
            onFileAccepted(selectedFile);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setNameStatus('idle');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Drop Zone — Apple-style elevated surface */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isLoading && inputRef.current?.click()}
                className="relative rounded-3xl p-12 md:p-16 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none"
                style={{
                    backgroundColor: isDragging
                        ? (theme === 'dark' ? 'rgba(0, 113, 227, 0.08)' : 'rgba(0, 113, 227, 0.03)')
                        : 'var(--bg-surface)',
                    boxShadow: isDragging ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                    border: isDragging ? '2px solid var(--brand-accent)' : '2px solid transparent',
                    opacity: isLoading ? 0.5 : 1,
                    pointerEvents: isLoading ? 'none' : 'auto',
                }}
            >
                {/* Icon — subtle, no background */}
                <div className="mb-6 transition-colors" style={{ color: isDragging ? 'var(--brand-accent)' : 'var(--text-muted)' }}>
                    {isLoading ? (
                        <div className="w-10 h-10 rounded-full animate-spin"
                            style={{ border: '3px solid var(--border-default)', borderTopColor: 'var(--brand-accent)' }} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    )}
                </div>

                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {isLoading ? 'Procesando archivo...' : 'Sube tu archivo REM'}
                </h3>
                <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Arrastra y suelta tu archivo .xlsx o .xlsm aquí, o haz clic para seleccionar.
                </p>

                {/* CTA — Apple-style solid pill button */}
                <div className="inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-medium transition-all"
                    style={{
                        backgroundColor: 'var(--brand-accent)',
                        borderRadius: 'var(--radius-full)',
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Seleccionar archivo
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xlsm"
                    onChange={handleInputChange}
                />

                {/* Feature badges — minimal Apple-style */}
                <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    {FEATURE_BADGES.map(feat => (
                        <span key={feat} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                            style={{ backgroundColor: 'var(--control-bg)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" style={{ color: 'var(--semantic-success)' }} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feat}
                        </span>
                    ))}
                </div>
            </div>

            {/* File name validation card */}
            {selectedFile && (
                <div className="mt-5 rounded-2xl p-5 flex items-center gap-4 transition-all animate-in slide-in-from-bottom-4 duration-300"
                    style={{
                        backgroundColor: 'var(--bg-surface)',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                    {/* Status icon */}
                    <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            backgroundColor: nameStatus === 'valid' ? 'var(--semantic-success-soft)' : 'var(--semantic-warning-soft)',
                            color: nameStatus === 'valid' ? 'var(--semantic-success)' : 'var(--semantic-warning)',
                        }}>
                        {nameStatus === 'valid' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: nameStatus === 'valid' ? 'var(--semantic-success)' : 'var(--semantic-warning)' }}>
                            {nameStatus === 'valid'
                                ? 'Nombre válido: [Código][Serie][Mes].xlsx'
                                : 'Formato esperado: 123456A01.xlsx'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReset(); }}
                            className="px-3 py-2 text-xs font-medium rounded-full transition-colors"
                            style={{
                                color: 'var(--text-secondary)',
                                backgroundColor: 'var(--control-bg)',
                            }}
                        >
                            Quitar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                            disabled={isLoading}
                            className="px-5 py-2 text-xs font-semibold text-white rounded-full transition-all disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--brand-accent)',
                            }}
                        >
                            Validar
                        </button>
                    </div>
                </div>
            )}

            {/* Format hint */}
            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
                Formato esperado: <code className="px-1.5 py-0.5 rounded-md font-mono text-[11px]" style={{
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-secondary)',
                }}>123100A02.xlsx</code>
            </p>
        </div>
    );
};

export default FileDropzone;
