import React, { useEffect, useState } from 'react';
import { get, create, update, type Regla } from '../../services/api/reglas';
import { AdminLayout } from './AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { ReglaForm, reglaFormFromRegla, reglaFormToPayload, type ReglaFormValues } from '../components/ReglaForm';

interface Props {
  reglaId?: string;
}

export const ReglaEditPage: React.FC<Props> = ({ reglaId }) => {
  const { user } = useAdminAuth();
  const isEdit = !!reglaId;
  const [initial, setInitial] = useState<ReglaFormValues | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (reglaId) {
      get(reglaId).then(r => setInitial(reglaFormFromRegla(r))).catch(e => setServerError((e as Error).message));
    } else {
      setInitial({
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
      });
    }
  }, [reglaId]);

  const handleSubmit = async (values: ReglaFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload = reglaFormToPayload(values);
      if (isEdit) {
        // No enviar regla_id en el update
        const { regla_id: _ignore, activo: _activo, ...rest } = payload;
        void _ignore; void _activo;
        await update(reglaId!, rest);
      } else {
        await create(payload);
      }
      window.location.href = '/admin/reglas';
    } catch (e) {
      const err = e as Error & { payload?: { error?: string } };
      setServerError(err.payload?.error ?? err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initial) {
    return (
      <AdminLayout user={user}>
        <div className="max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Cargando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? `Editar ${reglaId}` : 'Nueva regla'}
          </h1>
          <a href="/admin/reglas" className="text-sm" style={{ color: 'var(--text-secondary)' }}>← Volver al listado</a>
        </div>
        <ReglaForm
          initial={initial}
          onSubmit={handleSubmit}
          onCancel={() => { window.location.href = '/admin/reglas'; }}
          submitting={submitting}
          serverError={serverError}
          isEdit={isEdit}
        />
      </div>
    </AdminLayout>
  );
};
