import React, { useMemo, useState } from 'react';
import reglasFinalesRaw from '../data/reglas_finales.json';

interface ManualRule {
    id: string;
    rem_sheet: string;
    expresion_1: string;
    operador: string;
    expresion_2: string | number;
    severidad: string;
    mensaje: string;
    rem_sheet_2?: string;
    seccion_expresion_1?: string;
    descripcion_expresion_1?: string;
    descripcion_expresion_2?: string;
    aplicar_a?: string[];
    aplicar_a_tipo?: string[];
    excluir_tipo?: string[];
    establecimientos_excluidos?: string[];
    aplica_origen?: string;
}

const reglasFinales = reglasFinalesRaw as Record<string, ManualRule[]>;

const describeScope = (rule: ManualRule): string => {
    if (rule.aplicar_a_tipo?.length) {
        const normalizedTypes = rule.aplicar_a_tipo.map(type => type === 'POSTAS' ? 'POSTA' : type);
        return `Aplica a tipos: ${normalizedTypes.join(', ')}.`;
    }

    if (rule.aplicar_a?.length) {
        return `Aplica solo a ${rule.aplicar_a.length} establecimiento(s) especifico(s).`;
    }

    if (rule.excluir_tipo?.length) {
        return `Se evalua de forma general, excluyendo: ${rule.excluir_tipo.join(', ')}.`;
    }

    if (rule.establecimientos_excluidos?.length) {
        return 'Se evalua de forma general con exclusiones puntuales por codigo DEIS.';
    }

    if (rule.aplica_origen === 'POSTAS') {
        return 'Aplica a POSTA y POSTAS indistintamente; en el sistema ambas expresiones se interpretan como equivalentes.';
    }

    return 'Aplica de forma general segun las condiciones de la regla.';
};

const buildRuleExplanation = (rule: ManualRule): string => {
    const rightSheet = rule.rem_sheet_2 && rule.rem_sheet_2 !== rule.rem_sheet
        ? `${rule.rem_sheet_2}!${String(rule.expresion_2)}`
        : String(rule.expresion_2);

    return `Compara ${rule.rem_sheet}!${rule.expresion_1} ${rule.operador} ${rightSheet}. Si la referencia no trae datos, el sistema la interpreta como 0 o vacio segun corresponda.`;
};

const buildOperationalInterpretation = (rule: ManualRule): string => {
    if (rule.operador === '==') {
        return 'La validacion espera igualdad exacta entre el dato informado y su referencia. Si no coinciden, normalmente hay una inconsistencia de totalizacion o de traspaso entre secciones.';
    }

    if (rule.operador === '>=' || rule.operador === '>') {
        return 'La validacion espera que el numerador sea mayor que la referencia. Si falla, puede indicar subregistro en la expresion_1 o sobredeclaracion en la expresion_2.';
    }

    if (rule.operador === '<=' || rule.operador === '<') {
        return 'La validacion espera que el numerador no supere la referencia. Si falla, suele indicar un valor incompatible con el limite o total declarado.';
    }

    if (rule.operador === '!=') {
        return 'La validacion espera que ambos lados no sean iguales. Si coinciden, el sistema lo marca para revisar porque puede existir un registro no esperado.';
    }

    return 'La validacion compara el dato observado con una referencia tecnica y debe revisarse segun el contexto de la hoja REM.';
};

const buildPracticalExample = (rule: ManualRule): string => {
    const rightSide = rule.rem_sheet_2 && rule.rem_sheet_2 !== rule.rem_sheet
        ? `${rule.rem_sheet_2}!${String(rule.expresion_2)}`
        : `${rule.rem_sheet}!${String(rule.expresion_2)}`;

    return `Ejemplo: si ${rule.rem_sheet}!${rule.expresion_1} trae un valor y la referencia ${rightSide} esta vacia, el sistema compara contra 0 o vacio segun el tipo de regla. Luego determina si la relacion ${rule.operador} se cumple o no.`;
};

const ManualRuleExplorer: React.FC = () => {
    const sheetTabs = useMemo(
        () => Object.keys(reglasFinales).sort((a, b) => a.localeCompare(b, 'es', { numeric: true })),
        []
    );
    const [activeSheet, setActiveSheet] = useState<string>(sheetTabs[0] || 'A01');
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<'TODAS' | 'ERROR' | 'REVISAR' | 'INDICADOR'>('TODAS');
    const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
    const activeRules = useMemo(() => reglasFinales[activeSheet] || [], [activeSheet]);
    const activeSheetCounts = useMemo(() => ({
        total: activeRules.length,
        error: activeRules.filter(rule => rule.severidad === 'ERROR').length,
        revisar: activeRules.filter(rule => rule.severidad === 'REVISAR').length,
        indicador: activeRules.filter(rule => rule.severidad === 'INDICADOR').length,
    }), [activeRules]);
    const filteredRules = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return activeRules.filter((rule) => {
            const matchesSeverity = severityFilter === 'TODAS' || rule.severidad === severityFilter;
            if (!matchesSeverity) return false;
            if (!normalizedSearch) return true;

            const searchableText = [
                rule.id,
                rule.rem_sheet,
                rule.seccion_expresion_1,
                rule.descripcion_expresion_1,
                rule.descripcion_expresion_2,
                rule.mensaje,
                rule.expresion_1,
                String(rule.expresion_2),
                rule.severidad,
            ].join(' ').toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [activeRules, searchTerm, severityFilter]);

    return (
        <div className="deis-card p-6 md:p-8 space-y-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="space-y-2">
                <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Detalle de validaciones por hoja REM
                </h3>
                <p className="text-sm leading-relaxed max-w-4xl" style={{ color: 'var(--text-secondary)' }}>
                    Esta vista permite revisar las validaciones declaradas en el sistema por hoja REM. Cada pestana agrupa las reglas de una hoja y muestra su logica, alcance y severidad.
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Nota: cuando una regla se refiere a <strong style={{ color: 'var(--text-primary)' }}>POSTA</strong> o <strong style={{ color: 'var(--text-primary)' }}>POSTAS</strong>, el sistema las interpreta como equivalentes.
                </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {sheetTabs.map((sheet) => (
                    <button
                        key={sheet}
                        type="button"
                        onClick={() => {
                            setActiveSheet(sheet);
                            setExpandedRuleId(null);
                        }}
                        className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                        style={activeSheet === sheet
                            ? { backgroundColor: 'var(--brand-accent)', color: '#fff' }
                            : { backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)' }}
                    >
                        <span>{sheet}</span>
                        <span className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold"
                            style={activeSheet === sheet
                                ? { backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff' }
                                : { backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                            {(reglasFinales[sheet] || []).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Hoja activa: <strong style={{ color: 'var(--text-primary)' }}>{activeSheet}</strong></span>
                <span>Validaciones: <strong style={{ color: 'var(--text-primary)' }}>{activeSheetCounts.total}</strong></span>
                <span>ERROR: <strong style={{ color: 'var(--semantic-error)' }}>{activeSheetCounts.error}</strong></span>
                <span>REVISAR: <strong style={{ color: 'var(--semantic-warning)' }}>{activeSheetCounts.revisar}</strong></span>
                <span>INDICADOR: <strong style={{ color: 'var(--semantic-info)' }}>{activeSheetCounts.indicador}</strong></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                        Buscar validacion
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por ID, seccion, mensaje o celda"
                        className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--control-bg)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)',
                        }}
                    />
                </label>

                <label className="block min-w-[13rem]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                        Filtrar severidad
                    </span>
                    <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value as 'TODAS' | 'ERROR' | 'REVISAR' | 'INDICADOR')}
                        className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--control-bg)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)',
                        }}
                    >
                        <option value="TODAS">Todas</option>
                        <option value="ERROR">ERROR</option>
                        <option value="REVISAR">REVISAR</option>
                        <option value="INDICADOR">INDICADOR</option>
                    </select>
                </label>
            </div>

            <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Mostrando: <strong style={{ color: 'var(--text-primary)' }}>{filteredRules.length}</strong> de <strong style={{ color: 'var(--text-primary)' }}>{activeRules.length}</strong></span>
                {searchTerm ? <span>Busqueda: <strong style={{ color: 'var(--text-primary)' }}>{searchTerm}</strong></span> : null}
                {severityFilter !== 'TODAS' ? <span>Filtro: <strong style={{ color: 'var(--text-primary)' }}>{severityFilter}</strong></span> : null}
            </div>

            <div className="space-y-4 max-h-[48rem] overflow-y-auto pr-1">
                {filteredRules.map((rule) => (
                    <article key={rule.id} className="rounded-3xl border border-default p-5 space-y-4" style={{ backgroundColor: 'var(--control-bg)' }}>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--brand-accent)' }}>
                                        {rule.id}
                                    </span>
                                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                                        {rule.severidad}
                                    </span>
                                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                                        {rule.rem_sheet}
                                    </span>
                                </div>
                                <h4 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {rule.descripcion_expresion_1 || rule.mensaje}
                                </h4>
                                {rule.seccion_expresion_1 ? (
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {rule.seccion_expresion_1}
                                    </p>
                                ) : null}
                            </div>
                            <div className="rounded-2xl px-4 py-3 min-w-[16rem]" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Comparacion
                                </p>
                                <code className="text-sm break-all" style={{ color: 'var(--text-primary)' }}>
                                    {rule.expresion_1} {rule.operador} {String(rule.expresion_2)}
                                </code>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
                            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Explicacion de la validacion
                                </p>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {buildRuleExplanation(rule)}
                                </p>
                                {rule.descripcion_expresion_2 ? (
                                    <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                                        Referencia asociada: {rule.descripcion_expresion_2}
                                    </p>
                                ) : null}
                            </div>

                            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Alcance
                                </p>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {describeScope(rule)}
                                </p>
                                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                                    Mensaje base: {rule.mensaje}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Consulta el detalle operativo para entender como leer esta validacion en terreno.
                            </p>
                            <button
                                type="button"
                                onClick={() => setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)}
                                className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                                style={{ backgroundColor: 'var(--brand-accent)', color: '#fff' }}
                            >
                                {expandedRuleId === rule.id ? 'Ocultar detalle' : 'Ver detalle operativo'}
                            </button>
                        </div>

                        {expandedRuleId === rule.id ? (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 pt-2">
                                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                        Interpretacion operativa
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {buildOperationalInterpretation(rule)}
                                    </p>
                                </div>

                                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                        Ejemplo practico
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {buildPracticalExample(rule)}
                                    </p>
                                </div>

                                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                        Que revisar en el Excel
                                    </p>
                                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <li>Numerador: <code>{rule.rem_sheet}!{rule.expresion_1}</code></li>
                                        <li>Denominador o referencia: <code>{rule.rem_sheet_2 && rule.rem_sheet_2 !== rule.rem_sheet ? `${rule.rem_sheet_2}!` : ''}{String(rule.expresion_2)}</code></li>
                                        <li>Seccion principal: {rule.seccion_expresion_1 || 'No informada'}</li>
                                        <li>Descripcion principal: {rule.descripcion_expresion_1 || 'No informada'}</li>
                                    </ul>
                                </div>
                            </div>
                        ) : null}
                    </article>
                ))}

                {filteredRules.length === 0 ? (
                    <div className="rounded-3xl border border-default p-6 text-sm" style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)' }}>
                        No hay validaciones que coincidan con los filtros actuales. Prueba con otra hoja, otra severidad o una busqueda mas general.
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ManualRuleExplorer;
