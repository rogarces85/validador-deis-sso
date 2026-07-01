<?php
declare(strict_types=1);

/**
 * Validador de payloads para el CRUD de reglas.
 * Acepta arrays con claves permitidas y normaliza tipos.
 * Lanza InvalidArgumentException con mensaje en espanol ante cualquier
 * inconsistencia.
 */
final class RuleValidator
{
    public static function validateCreate(array $data): array
    {
        $out = [];
        $out['regla_id'] = Validator::require_string($data, 'regla_id', 3, 40);
        $out['serie'] = strtoupper(Validator::require_string($data, 'serie', 1, 1));
        if (!in_array($out['serie'], ['A', 'P'], true)) {
            throw new InvalidArgumentException('La serie debe ser A o P');
        }
        $out['rem_sheet'] = strtoupper(Validator::require_string($data, 'rem_sheet', 1, 20));
        if (!preg_match('/^[A-Z][A-Z0-9]*$/', $out['rem_sheet'])) {
            throw new InvalidArgumentException('La hoja REM solo puede tener letras y numeros');
        }
        $out['tipo'] = strtoupper(Validator::require_string($data, 'tipo', 1, 20));
        if (!in_array($out['tipo'], Regla::TIPOS, true)) {
            throw new InvalidArgumentException('El tipo debe ser uno de ' . implode(', ', Regla::TIPOS));
        }
        $out['expresion_1'] = Validator::require_string($data, 'expresion_1', 1, 255);
        $out['operador'] = Validator::require_string($data, 'operador', 1, 5);
        if (!in_array($out['operador'], Regla::OPERADORES, true)) {
            throw new InvalidArgumentException('El operador debe ser uno de ' . implode(', ', Regla::OPERADORES));
        }
        $out['expresion_2'] = self::normalizeExpresion2($data['expresion_2'] ?? null);
        $out['severidad'] = strtoupper(Validator::require_string($data, 'severidad', 1, 20));
        if (!in_array($out['severidad'], Regla::SEVERIDADES, true)) {
            throw new InvalidArgumentException('La severidad debe ser una de ' . implode(', ', Regla::SEVERIDADES));
        }
        $out['mensaje'] = Validator::require_string($data, 'mensaje', 1, 1000);
        $out['omitir_si_ambos_cero'] = self::normalizeBool($data['omitir_si_ambos_cero'] ?? false);
        $out['omitir_si_v1_es_cero'] = self::normalizeBool($data['omitir_si_v1_es_cero'] ?? false);
        $out['validacion_exclusiva'] = self::normalizeBool($data['validacion_exclusiva'] ?? false);
        $out['aplicar_a_tipo'] = self::normalizeTipoList($data['aplicar_a_tipo'] ?? []);
        $out['excluir_tipo'] = self::normalizeTipoList($data['excluir_tipo'] ?? []);
        $out['aplicar_a'] = self::normalizeStringList($data['aplicar_a'] ?? [], 6, 'aplicar_a');
        $out['establecimientos_excluidos'] = self::normalizeStringList($data['establecimientos_excluidos'] ?? [], 6, 'establecimientos_excluidos');
        return $out;
    }

    public static function validateUpdate(array $data): array
    {
        $out = [];
        $out['tipo'] = strtoupper(Validator::require_string($data, 'tipo', 1, 20));
        if (!in_array($out['tipo'], Regla::TIPOS, true)) {
            throw new InvalidArgumentException('El tipo debe ser uno de ' . implode(', ', Regla::TIPOS));
        }
        $out['expresion_1'] = Validator::require_string($data, 'expresion_1', 1, 255);
        $out['operador'] = Validator::require_string($data, 'operador', 1, 5);
        if (!in_array($out['operador'], Regla::OPERADORES, true)) {
            throw new InvalidArgumentException('El operador debe ser uno de ' . implode(', ', Regla::OPERADORES));
        }
        $out['expresion_2'] = self::normalizeExpresion2($data['expresion_2'] ?? null);
        $out['severidad'] = strtoupper(Validator::require_string($data, 'severidad', 1, 20));
        if (!in_array($out['severidad'], Regla::SEVERIDADES, true)) {
            throw new InvalidArgumentException('La severidad debe ser una de ' . implode(', ', Regla::SEVERIDADES));
        }
        $out['mensaje'] = Validator::require_string($data, 'mensaje', 1, 1000);
        $out['omitir_si_ambos_cero'] = self::normalizeBool($data['omitir_si_ambos_cero'] ?? false);
        $out['omitir_si_v1_es_cero'] = self::normalizeBool($data['omitir_si_v1_es_cero'] ?? false);
        $out['validacion_exclusiva'] = self::normalizeBool($data['validacion_exclusiva'] ?? false);
        $out['aplicar_a_tipo'] = self::normalizeTipoList($data['aplicar_a_tipo'] ?? []);
        $out['excluir_tipo'] = self::normalizeTipoList($data['excluir_tipo'] ?? []);
        $out['aplicar_a'] = self::normalizeStringList($data['aplicar_a'] ?? [], 6, 'aplicar_a');
        $out['establecimientos_excluidos'] = self::normalizeStringList($data['establecimientos_excluidos'] ?? [], 6, 'establecimientos_excluidos');
        return $out;
    }

    private static function normalizeExpresion2(mixed $value): mixed
    {
        if ($value === null) {
            return null;
        }
        if (is_int($value) || is_float($value)) {
            return $value;
        }
        if (is_bool($value)) {
            return $value ? 1 : 0;
        }
        if (is_string($value)) {
            $trimmed = trim($value);
            if ($trimmed === '') {
                return null;
            }
            if (is_numeric($trimmed)) {
                return str_contains($trimmed, '.') ? (float) $trimmed : (int) $trimmed;
            }
            if (mb_strlen($trimmed) > 255) {
                throw new InvalidArgumentException('La expresion 2 no puede exceder 255 caracteres');
            }
            return $trimmed;
        }
        throw new InvalidArgumentException('expresion_2 debe ser numero, string o null');
    }

    private static function normalizeBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        if (is_int($value)) {
            return $value === 1;
        }
        if (is_string($value)) {
            $v = strtolower(trim($value));
            return in_array($v, ['1', 'true', 'si', 'yes'], true);
        }
        return false;
    }

    private static function normalizeTipoList(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }
        $out = [];
        foreach ($value as $item) {
            if (is_string($item)) {
                $upper = strtoupper(trim($item));
                if ($upper !== '') {
                    $out[] = $upper;
                }
            }
        }
        return array_values(array_unique($out));
    }

    private static function normalizeStringList(mixed $value, int $exactLength, string $fieldName): array
    {
        if (!is_array($value)) {
            return [];
        }
        $out = [];
        foreach ($value as $item) {
            if (is_string($item)) {
                $trimmed = trim($item);
                if (strlen($trimmed) === $exactLength) {
                    $out[] = $trimmed;
                } elseif ($trimmed !== '') {
                    throw new InvalidArgumentException("El campo '$fieldName' debe tener exactamente $exactLength caracteres (recibido: '$trimmed')");
                }
            }
        }
        return array_values(array_unique($out));
    }
}
