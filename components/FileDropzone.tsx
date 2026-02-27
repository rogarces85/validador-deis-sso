import React, { useState, useCallback, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { FilenameValidatorService, VALID_SERIES } from '../services/filenameValidator';

interface FileDropzoneProps {
    onFileAccepted: (file: File) => void;
    isLoading: boolean;
}

// Reuse a single instance
const filenameValidator = new FilenameValidatorService();

// rendering-hoist-jsx: static array hoisted outside component
const FEATURE_BADGES = ['Validación de Nombre', 'Cruces de Información', 'Reporte Automático'] as const;

type FileNameStatus = 'idle' | 'valid' | 'invalid';

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileAccepted, isLoading }) => {
    const { theme } = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [nameStatus, setNameStatus] = useState<FileNameStatus>('idle');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndSet = useCallback((file: File) => {
        setSelectedFile(file);
        const result = filenameValidator.validate(file.name);
        setNameStatus(result.isValid ? 'valid' : 'invalid');
        setValidationErrors(result.errors);
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
        if (selectedFile && nameStatus === 'valid') {
            onFileAccepted(selectedFile);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setNameStatus('idle');
        setValidationErrors([]);
        if (inputRef.current) inputRef.current.value = '';
    };

    // Determine styling based on validation status
    const isInvalid = nameStatus === 'invalid';
    const statusColor = isInvalid ? 'var(--semantic-error)' : 'var(--semantic-success)';
    const statusBgColor = isInvalid ? 'var(--semantic-error-soft)' : 'var(--semantic-success-soft)';

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
                <div className="mt-5 rounded-2xl p-5 transition-all animate-in slide-in-from-bottom-4 duration-300"
                    style={{
                        backgroundColor: isInvalid ? 'var(--semantic-error-soft)' : 'var(--bg-surface)',
                        boxShadow: 'var(--shadow-sm)',
                        border: isInvalid ? '1px solid var(--semantic-error-border)' : '1px solid transparent',
                    }}>
                    <div className="flex items-start gap-4">
                        {/* Status icon */}
                        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                                backgroundColor: statusBgColor,
                                color: statusColor,
                            }}>
                            {nameStatus === 'valid' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</p>
                            {nameStatus === 'valid' ? (
                                <p className="text-xs mt-0.5" style={{ color: 'var(--semantic-success)' }}>
                                    Nombre válido: [Código][Serie][Mes].xlsx
                                </p>
                            ) : (
                                <div className="mt-1 space-y-1">
                                    {validationErrors.map((err, i) => (
                                        <p key={i} className="text-xs flex items-start gap-1" style={{ color: 'var(--semantic-error)' }}>
                                            <span className="shrink-0 mt-0.5">•</span>
                                            <span>{err}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
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
                                disabled={isLoading || isInvalid}
                                className="px-5 py-2 text-xs font-semibold text-white rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: isInvalid ? 'var(--text-muted)' : 'var(--brand-accent)',
                                }}
                                title={isInvalid ? 'Corrige el nombre del archivo para continuar' : 'Iniciar validación'}
                            >
                                Validar
                            </button>
                        </div>
                    </div>

                    {/* Blocked message for invalid files */}
                    {isInvalid && (
                        <div className="mt-3 pt-3 flex items-center gap-2 text-xs font-medium"
                            style={{ borderTop: '1px solid var(--semantic-error-border)', color: 'var(--semantic-error)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            El archivo no puede ser procesado. Renombre el archivo con el formato correcto y vuelva a intentar.
                        </div>
                    )}
                </div>
            )}

            {/* Format hint */}
            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
                Formato esperado: <code className="px-1.5 py-0.5 rounded-md font-mono text-[11px]" style={{
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-secondary)',
                }}>123100A02.xlsx</code>
                {' · '}
                Series válidas: <code className="px-1.5 py-0.5 rounded-md font-mono text-[11px]" style={{
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-secondary)',
                }}>{VALID_SERIES.join(', ')}</code>
            </p>
        </div>
    );
};

export default FileDropzone;
