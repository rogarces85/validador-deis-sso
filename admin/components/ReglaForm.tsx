import React, { useState } from 'react';
import { SeveridadPicker, type Severidad } from './SeveridadPicker';
import { OperadorPicker, type Operador } from './OperadorPicker';
import { ExpresionInput } from './ExpresionInput';
import { ExpresionPreview } from './ExpresionPreview';
import { MultiSelectTipos } from './MultiSelectTipos';
import { MultiSelectEstablecimientos } from './MultiSelectEstablecimientos';
import type { Regla, ReglaPayload, TipoRegla } from '../../services/api/reglas';

const TIPOS: TipoRegla[] = ['CELDA', 'RANGO', 'SUMA', 'CRUCE'];

export interface ReglaFormValues {
  regla_id: string;
  serie: 'A' | 'P';
  rem_sheet: string;
  tipo: TipoRegla;
  expresion_1: string;
  operador: Operador;
  expresion_2: string;
  severidad: Severidad;
  mensaje: string;
  omitir_si_ambos_cero: boolean;
  omitir_si_v1_es_cero: boolean;
  validacion_exclusiva: boolean;
  aplicar_a_tipo: string[];
  excluir_tipo: string[];
  aplicar_a: string[];
  establecimientos_excluidos: string[];
}

interface Props {
  initial: Partial<ReglaFormValues> & { regla_id?: string };
  onSubmit: (values: ReglaFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting: boolean;
  serverError: string | null;
  isEdit?: boolean;
}

const empty: ReglaFormValues = {
  regla_id: '',
  serie: 'A',
  rem_sheet: 'A01',
  tipo: 'CELDA',
  expresion_1: '',
  operador: '==',
  expresion_2: '0',
  severidad: 'REVISAR',
  mensaje: '',
  omitir_si_ambos_cero: false,
  omitir_si_v1_es_cero: false,
  validacion_exclusiva: false,
  aplicar_a_tipo: [],
  excluir_tipo: [],
  aplicar_a: [],
  establecimientos_excluidos: [],
};

function fromRegla(r: Regla): ReglaFormValues {
  return {
    regla_id: r.regla_id,
    serie: r.serie,
    rem_sheet: r.rem_sheet,
    tipo: r.tipo,
    expresion_1: r.expresion_1,
    operador: r.operador,
    expresion_2: r.expresion_2 === null ? '' : String(r.expresion_2),
    severidad: r.severidad,
    mensaje: r.mensaje,
    omitir_si_ambos_cero: r.omitir_si_ambos_cero,
    omitir_si_v1_es_cero: r.omitir_si_v1_es_cero,
    validacion_exclusiva: r.validacion_exclusiva,
    aplicar_a_tipo: r.aplicar_a_tipo,
    excluir_tipo: r.excluir_tipo,
    aplicar_a: r.aplicar_a,
    establecimientos_excluidos: r.establecimientos_excluidos,
  };
}

export const ReglaForm: React.FC<Props> = ({ initial, onSubmit, onCancel, submitting, serverError, isEdit }) => {
  const [values, setValues] = useState<ReglaFormValues>(() => {
    if (initial.regla_id && initial.mensaje !== undefined) {
      return { ...empty, ...initial } as ReglaFormValues;
    }
    return { ...empty, ...initial } as ReglaFormValues;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof ReglaFormValues>(k: K, v: ReglaFormValues[K]) => {
    setValues(prev => ({ ...prev, [k]: v }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!isEdit && !values.regla_id.trim()) e.regla_id = 'El ID de regla es obligatorio';
    if (!values.rem_sheet.trim()) e.rem_sheet = 'La hoja REM es obligatoria';
    if (!values.expresion_1.trim()) e.expresion_1 = 'La expresion 1 es obligatoria';
    if (!values.mensaje.trim()) e.mensaje = 'El mensaje humano es obligatorio';
    if (values.expresion_2 !== '' && values.expresion_2 !== null) {
      const e2 = values.expresion_2.trim();
      const isNum = /^\d+(\.\d+)?$/.test(e2);
      const isCell = /^[A-Z]+\d+(:[A-Z]+\d+)?$/i.test(e2);
      const isRange = /^[A-Z]+\d+:[A-Z]+\d+$/i.test(e2);
      if (!isNum && !isCell && !isRange) {
        e.expresion_2 = 'Debe ser numero, celda (A1) o rango (A1:B10)';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: 'var(--semantic-error-soft)', color: 'var(--semantic-error)', border: '1px solid var(--semantic-error-border)' }}>
          {serverError}
        </div>
      )}

      {/* Identidad */}
      <details open className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          1. Identidad
        </summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>ID de regla</label>
            <input
              type="text"
              value={values.regla_id}
              onChange={e => set('regla_id', e.target.value.toUpperCase())}
              disabled={isEdit}
              placeholder="ej. A01-VAL001"
              className="w-full px-3 py-2 rounded-xl font-mono text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            />
            {errors.regla_id && <p className="text-xs mt-1" style={{ color: 'var(--semantic-error)' }}>{errors.regla_id}</p>}
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Unico. Formato sugerido: AXX-VALYYY o PXX-VALYYY.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Serie REM</label>
            <div className="grid grid-cols-2 gap-2">
              {(['A', 'P'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('serie', s)}
                  className="px-3 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: values.serie === s ? 'var(--brand-accent)' : 'var(--bg-surface)',
                    color: values.serie === s ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  Serie {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Hoja REM (rem_sheet)</label>
            <input
              type="text"
              value={values.rem_sheet}
              onChange={e => set('rem_sheet', e.target.value.toUpperCase())}
              placeholder="ej. A01"
              className="w-full px-3 py-2 rounded-xl font-mono text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            />
            {errors.rem_sheet && <p className="text-xs mt-1" style={{ color: 'var(--semantic-error)' }}>{errors.rem_sheet}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Tipo</label>
            <select
              value={values.tipo}
              onChange={e => set('tipo', e.target.value as TipoRegla)}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            >
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </details>

      {/* Expresion */}
      <details open className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          2. Expresion de comparacion
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Expresion 1 (numerador)</label>
            <ExpresionInput
              value={values.expresion_1}
              onChange={v => set('expresion_1', v)}
              placeholder="ej. F11, SUM(C21:C36), A03!C108"
              rows={2}
              disabled={submitting}
            />
            {errors.expresion_1 && <p className="text-xs mt-1" style={{ color: 'var(--semantic-error)' }}>{errors.expresion_1}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Operador</label>
            <OperadorPicker value={values.operador} onChange={v => set('operador', v)} disabled={submitting} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Expresion 2 (denominador / referencia)</label>
            <ExpresionInput
              value={values.expresion_2}
              onChange={v => set('expresion_2', v)}
              placeholder="ej. 0, B5, SUM(A1:A10)"
              rows={2}
              disabled={submitting}
            />
            {errors.expresion_2 && <p className="text-xs mt-1" style={{ color: 'var(--semantic-error)' }}>{errors.expresion_2}</p>}
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Vacio se trata como 0.</p>
          </div>
          <ExpresionPreview expresion={values.expresion_2 === '' ? values.expresion_1 : `${values.expresion_1} ${values.operador} ${values.expresion_2}`} />
        </div>
      </details>

      {/* Severidad y mensaje */}
      <details open className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          3. Severidad y mensaje
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Severidad</label>
            <SeveridadPicker value={values.severidad} onChange={v => set('severidad', v)} disabled={submitting} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Mensaje humano</label>
            <textarea
              value={values.mensaje}
              onChange={e => set('mensaje', e.target.value)}
              rows={3}
              placeholder="ej. REM A01 | SECCION A | F11. La expresion indica que [F11] debe ser distinto de [0]."
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            />
            {errors.mensaje && <p className="text-xs mt-1" style={{ color: 'var(--semantic-error)' }}>{errors.mensaje}</p>}
          </div>
        </div>
      </details>

      {/* Alcance y flags */}
      <details className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          4. Alcance y flags (avanzado)
        </summary>
        <div className="mt-4 space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={values.omitir_si_ambos_cero}
                onChange={e => set('omitir_si_ambos_cero', e.target.checked)}
              />
              Omitir si ambos valores son 0
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={values.omitir_si_v1_es_cero}
                onChange={e => set('omitir_si_v1_es_cero', e.target.checked)}
              />
              Omitir si la expresion 1 es 0 o vacia
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={values.validacion_exclusiva}
                onChange={e => set('validacion_exclusiva', e.target.checked)}
              />
              Validacion exclusiva (invierte operador y aprueba al objetivo)
            </label>
          </div>
          <MultiSelectTipos
            label="Aplicar a tipos de establecimiento"
            selected={values.aplicar_a_tipo}
            onChange={v => set('aplicar_a_tipo', v)}
            helpText="Si se especifica, la regla solo aplica a estos tipos de establecimiento."
          />
          <MultiSelectTipos
            label="Excluir tipos de establecimiento"
            selected={values.excluir_tipo}
            onChange={v => set('excluir_tipo', v)}
            helpText="Tipos que NUNCA seran evaluados por esta regla."
          />
          <MultiSelectEstablecimientos
            label="Aplicar a establecimientos especificos (codigo DEIS de 6 digitos)"
            selected={values.aplicar_a}
            onChange={v => set('aplicar_a', v)}
            helpText="Si se especifica, la regla solo aplica a estos codigos."
          />
          <MultiSelectEstablecimientos
            label="Excluir establecimientos especificos"
            selected={values.establecimientos_excluidos}
            onChange={v => set('establecimientos_excluidos', v)}
            helpText="Codigos DEIS que ignoran esta validacion."
          />
        </div>
      </details>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ backgroundColor: 'var(--brand-accent)', color: 'white', opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Guardar borrador')}
        </button>
      </div>
    </form>
  );
};

export const reglaFormFromRegla = fromRegla;
export const reglaFormToPayload = (v: ReglaFormValues): ReglaPayload => ({
  regla_id: v.regla_id,
  serie: v.serie,
  rem_sheet: v.rem_sheet,
  tipo: v.tipo,
  expresion_1: v.expresion_1,
  operador: v.operador,
  expresion_2: v.expresion_2 === '' ? 0 : (() => {
    const t = v.expresion_2.trim();
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    if (/^\d+\.\d+$/.test(t)) return parseFloat(t);
    return t;
  })(),
  severidad: v.severidad,
  mensaje: v.mensaje,
  omitir_si_ambos_cero: v.omitir_si_ambos_cero,
  omitir_si_v1_es_cero: v.omitir_si_v1_es_cero,
  validacion_exclusiva: v.validacion_exclusiva,
  aplicar_a_tipo: v.aplicar_a_tipo,
  excluir_tipo: v.excluir_tipo,
  aplicar_a: v.aplicar_a,
  establecimientos_excluidos: v.establecimientos_excluidos,
  activo: true,
});
