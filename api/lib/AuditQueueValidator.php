<?php
declare(strict_types=1);

/**
 * Validador de eventos de auditoria.
 * Aplica una lista blanca ESTRICTA de campos definidos en el
 * Principio I.a de la constitucion v1.2.0. Cualquier campo extra
 * (ej. "valor_celda", "contenido_hoja") se rechaza con 400.
 */
final class AuditQueueValidator
{
    public const CAMPOS = [
        'nombre_archivo' => ['type' => 'string', 'min' => 1, 'max' => 255],
        'codigo_establecimiento' => ['type' => 'string', 'min' => 6, 'max' => 6],
        'nombre_establecimiento' => ['type' => 'string', 'min' => 0, 'max' => 160, 'optional' => true],
        'comuna' => ['type' => 'string', 'min' => 0, 'max' => 80, 'optional' => true],
        'tipo_establecimiento' => ['type' => 'string', 'min' => 0, 'max' => 20, 'optional' => true],
        'serie' => ['type' => 'string', 'min' => 1, 'max' => 1, 'enum' => ['A', 'P']],
        'mes' => ['type' => 'string', 'min' => 2, 'max' => 2, 'pattern' => '/^\d{2}$/'],
        'periodo' => ['type' => 'string', 'min' => 0, 'max' => 4, 'optional' => true, 'pattern' => '/^\d{4}$/'],
        'total_hallazgos' => ['type' => 'int', 'min' => 0],
        'conteo_error' => ['type' => 'int', 'min' => 0, 'optional' => true],
        'conteo_revisar' => ['type' => 'int', 'min' => 0, 'optional' => true],
        'conteo_indicador' => ['type' => 'int', 'min' => 0, 'optional' => true],
        'resultado_final' => ['type' => 'string', 'min' => 1, 'max' => 30, 'enum' => AuditLog::RESULTADOS],
        'duracion_ms' => ['type' => 'int', 'min' => 0, 'optional' => true],
    ];

    /**
     * @return array payload normalizado y validado
     */
    public static function validate(array $data): array
    {
        // Lista blanca estricta: cualquier campo fuera de CAMPOS se rechaza.
        $unknown = array_diff(array_keys($data), array_keys(self::CAMPOS));
        if (!empty($unknown)) {
            throw new InvalidArgumentException(
                'Campos no permitidos (lista blanca estricta): ' . implode(', ', $unknown)
            );
        }

        $out = [];
        foreach (self::CAMPOS as $field => $spec) {
            $present = array_key_exists($field, $data);
            $value = $data[$field] ?? null;
            $optional = !empty($spec['optional']);

            if (!$present || $value === null || $value === '') {
                if ($optional) {
                    continue;
                }
                throw new InvalidArgumentException("Campo obligatorio '$field' ausente o vacio");
            }

            // Validacion de tipo
            switch ($spec['type']) {
                case 'string':
                    if (!is_string($value)) {
                        throw new InvalidArgumentException("El campo '$field' debe ser string");
                    }
                    $len = mb_strlen($value);
                    if ($len < ($spec['min'] ?? 0)) {
                        throw new InvalidArgumentException("El campo '$field' debe tener al menos " . ($spec['min'] ?? 0) . " caracteres");
                    }
                    if (isset($spec['max']) && $len > $spec['max']) {
                        throw new InvalidArgumentException("El campo '$field' debe tener como maximo " . $spec['max'] . " caracteres");
                    }
                    if (isset($spec['pattern']) && !preg_match($spec['pattern'], $value)) {
                        throw new InvalidArgumentException("El campo '$field' no cumple el formato esperado");
                    }
                    if (isset($spec['enum']) && !in_array($value, $spec['enum'], true)) {
                        throw new InvalidArgumentException("El campo '$field' debe ser uno de " . implode(', ', $spec['enum']));
                    }
                    $out[$field] = $value;
                    break;
                case 'int':
                    if (!is_int($value) && !(is_string($value) && ctype_digit($value))) {
                        throw new InvalidArgumentException("El campo '$field' debe ser entero");
                    }
                    $iv = (int) $value;
                    if ($iv < ($spec['min'] ?? 0)) {
                        throw new InvalidArgumentException("El campo '$field' debe ser >= " . ($spec['min'] ?? 0));
                    }
                    $out[$field] = $iv;
                    break;
                default:
                    throw new InvalidArgumentException("Tipo de campo desconocido: " . $spec['type']);
            }
        }

        // Invariantes de negocio
        $ce = (int) ($out['conteo_error'] ?? 0);
        $cr = (int) ($out['conteo_revisar'] ?? 0);
        $ci = (int) ($out['conteo_indicador'] ?? 0);
        $total = (int) $out['total_hallazgos'];
        if ($ce + $cr + $ci > $total + 100) {
            // tolerancia de 100 hallazgos extra no categorizados
            throw new InvalidArgumentException(
                'La suma de conteos por severidad excede el total de hallazgos'
            );
        }
        if (!in_array($out['resultado_final'], AuditLog::RESULTADOS, true)) {
            throw new InvalidArgumentException("resultado_final invalido");
        }

        return $out;
    }
}
