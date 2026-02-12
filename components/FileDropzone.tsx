import React, { useState, useCallback, useRef } from 'react';

interface FileDropzoneProps {
    onFileAccepted: (file: File) => void;
    isLoading: boolean;
}

const FILE_PATTERN = /^(\d{6})([A-Z0-9]{1})(\d{2})\.(xlsx|xlsm)$/i;

type FileNameStatus = 'idle' | 'valid' | 'invalid';

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileAccepted, isLoading }) => {
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
        <div className="max-w-3xl mx-auto">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isLoading && inputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-10 md:p-14 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none ${isDragging
                    ? 'border-blue-500 bg-blue-50/80 scale-[1.01] shadow-xl shadow-blue-100'
                    : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'
                    } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {/* Icon */}
                <div className={`mb-5 p-5 rounded-2xl transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isLoading ? (
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {isLoading ? 'Procesando archivo...' : 'Sube tu archivo REM'}
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">
                    Arrastra y suelta tu archivo .xlsx o .xlsm aquí, o haz clic para seleccionar.
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all">
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

                {/* Feature badges */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-slate-400 font-medium">
                    {['Validación de Nombre', 'Cruces de Información', 'Reporte Automático'].map(feat => (
                        <span key={feat} className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feat}
                        </span>
                    ))}
                </div>
            </div>

            {/* File name validation card */}
            {selectedFile && (
                <div className={`mt-4 rounded-xl border p-4 flex items-center gap-4 transition-all animate-in slide-in-from-bottom-4 duration-300 ${nameStatus === 'valid'
                    ? 'bg-emerald-50 border-emerald-200'
                    : nameStatus === 'invalid'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                    {/* Status icon */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${nameStatus === 'valid' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
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
                        <p className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</p>
                        <p className={`text-xs mt-0.5 ${nameStatus === 'valid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {nameStatus === 'valid'
                                ? 'Nombre válido: [Código][Serie][Mes].xlsx'
                                : 'Formato esperado: 123456A01.xlsx'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReset(); }}
                            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded-lg transition-colors"
                        >
                            Quitar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                            disabled={isLoading}
                            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            Validar
                        </button>
                    </div>
                </div>
            )}

            {/* Format hint */}
            <p className="text-center text-xs text-slate-400 mt-4">
                Formato esperado: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono text-[11px]">123100A02.xlsx</code>
            </p>
        </div>
    );
};

export default FileDropzone;
