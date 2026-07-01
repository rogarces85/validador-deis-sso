<?php
declare(strict_types=1);

final class Regla
{
    public const SEVERIDADES = ['ERROR', 'REVISAR', 'INDICADOR'];
    public const OPERADORES = ['==', '!=', '>', '<', '>=', '<='];
    public const TIPOS = ['CELDA', 'RANGO', 'SUMA', 'CRUCE'];

    /**
     * Lista reglas con filtros y paginacion.
     * @return array{items: array<int, array>, total: int}
     */
    public static function list(array $filtros, int $page = 1, int $perPage = 20): array
    {
        $page = max(1, $page);
        $perPage = max(1, min(200, $perPage));
        $offset = ($page - 1) * $perPage;

        $where = [];
        $params = [];
        if (!($filtros['incluir_desactivadas'] ?? false)) {
            $where[] = 'activo = 1';
        }
        if (!empty($filtros['serie'])) {
            $where[] = 'serie = :serie';
            $params[':serie'] = strtoupper((string) $filtros['serie']);
        }
        if (!empty($filtros['rem_sheet'])) {
            $where[] = 'rem_sheet = :rem_sheet';
            $params[':rem_sheet'] = (string) $filtros['rem_sheet'];
        }
        if (!empty($filtros['severidad']) && in_array($filtros['severidad'], self::SEVERIDADES, true)) {
            $where[] = 'severidad = :sev';
            $params[':sev'] = (string) $filtros['severidad'];
        }
        if (!empty($filtros['q'])) {
            $where[] = '(regla_id LIKE :q OR mensaje LIKE :q)';
            $params[':q'] = '%' . (string) $filtros['q'] . '%';
        }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

        $pdo = db();
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM reglas $whereSql");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $sql = "SELECT * FROM reglas $whereSql ORDER BY serie, rem_sheet, regla_id LIMIT :lim OFFSET :off";
        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();

        return ['items' => array_map([self::class, 'normalize'], $items), 'total' => $total];
    }

    public static function findByReglaId(string $reglaId): ?array
    {
        $stmt = db()->prepare('SELECT * FROM reglas WHERE regla_id = :id LIMIT 1');
        $stmt->execute([':id' => $reglaId]);
        $row = $stmt->fetch();
        return $row === false ? null : self::normalize($row);
    }

    public static function findById(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM reglas WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row === false ? null : self::normalize($row);
    }

    public static function create(array $payload, int $autor): int
    {
        $stmt = db()->prepare(
            'INSERT INTO reglas (
                regla_id, serie, rem_sheet, tipo, expresion_1, operador, expresion_2,
                severidad, mensaje,
                omitir_si_ambos_cero, omitir_si_v1_es_cero, validacion_exclusiva,
                aplicar_a_tipo, excluir_tipo, aplicar_a, establecimientos_excluidos,
                activo, actualizado_por
            ) VALUES (
                :regla_id, :serie, :rem_sheet, :tipo, :exp1, :op, :exp2,
                :sev, :msg,
                :o0, :o1, :ve,
                :aat, :et, :aa, :ee,
                1, :autor
            )'
        );
        $stmt->execute(self::bindPayload($payload, $autor));
        return (int) db()->lastInsertId();
    }

    public static function update(string $reglaId, array $payload, int $autor): ?array
    {
        $current = self::findByReglaId($reglaId);
        if (!$current) {
            return null;
        }
        $merged = array_merge(self::denormalize($current), $payload);
        $merged['regla_id'] = $reglaId;
        $stmt = db()->prepare(
            'UPDATE reglas SET
                tipo = :tipo,
                expresion_1 = :exp1,
                operador = :op,
                expresion_2 = :exp2,
                severidad = :sev,
                mensaje = :msg,
                omitir_si_ambos_cero = :o0,
                omitir_si_v1_es_cero = :o1,
                validacion_exclusiva = :ve,
                aplicar_a_tipo = :aat,
                excluir_tipo = :et,
                aplicar_a = :aa,
                establecimientos_excluidos = :ee,
                actualizado_por = :autor
             WHERE regla_id = :regla_id'
        );
        $bind = self::bindUpdatePayload($merged, $autor);
        $stmt->execute($bind);
        return self::findByReglaId($reglaId);
    }

    public static function deactivate(string $reglaId, int $autor): ?array
    {
        $current = self::findByReglaId($reglaId);
        if (!$current) {
            return null;
        }
        db()->prepare('UPDATE reglas SET activo = 0, actualizado_por = :a WHERE regla_id = :id')
            ->execute([':a' => $autor, ':id' => $reglaId]);
        return self::findByReglaId($reglaId);
    }

    public static function activate(string $reglaId, int $autor): ?array
    {
        $current = self::findByReglaId($reglaId);
        if (!$current) {
            return null;
        }
        db()->prepare('UPDATE reglas SET activo = 1, actualizado_por = :a WHERE regla_id = :id')
            ->execute([':a' => $autor, ':id' => $reglaId]);
        return self::findByReglaId($reglaId);
    }

    public static function reglaIdExists(string $reglaId): bool
    {
        $stmt = db()->prepare('SELECT 1 FROM reglas WHERE regla_id = :id LIMIT 1');
        $stmt->execute([':id' => $reglaId]);
        return $stmt->fetch() !== false;
    }

    public static function countActive(): int
    {
        return (int) db()->query('SELECT COUNT(*) FROM reglas WHERE activo = 1')->fetchColumn();
    }

    public static function listActiveForSnapshot(): array
    {
        $rows = db()->query('SELECT * FROM reglas WHERE activo = 1 ORDER BY serie, rem_sheet, regla_id')->fetchAll();
        return array_map([self::class, 'normalize'], $rows);
    }

    /**
     * Convierte una fila cruda de la BD al formato publico.
     * expresion_2 (JSON) se decodifica a su tipo original.
     */
    public static function normalize(array $row): array
    {
        $out = [
            'id' => (int) $row['id'],
            'regla_id' => (string) $row['regla_id'],
            'serie' => (string) $row['serie'],
            'rem_sheet' => (string) $row['rem_sheet'],
            'tipo' => (string) $row['tipo'],
            'expresion_1' => (string) $row['expresion_1'],
            'operador' => (string) $row['operador'],
            'expresion_2' => self::decodeExpresion2($row['expresion_2'] ?? null),
            'severidad' => (string) $row['severidad'],
            'mensaje' => (string) $row['mensaje'],
            'omitir_si_ambos_cero' => (int) $row['omitir_si_ambos_cero'] === 1,
            'omitir_si_v1_es_cero' => (int) $row['omitir_si_v1_es_cero'] === 1,
            'validacion_exclusiva' => (int) $row['validacion_exclusiva'] === 1,
            'aplicar_a_tipo' => self::decodeJsonArray($row['aplicar_a_tipo'] ?? null),
            'excluir_tipo' => self::decodeJsonArray($row['excluir_tipo'] ?? null),
            'aplicar_a' => self::decodeJsonArray($row['aplicar_a'] ?? null),
            'establecimientos_excluidos' => self::decodeJsonArray($row['establecimientos_excluidos'] ?? null),
            'activo' => (int) $row['activo'] === 1,
            'actualizado_por' => $row['actualizado_por'] !== null ? (int) $row['actualizado_por'] : null,
            'actualizado_en' => $row['actualizado_en'] ?? null,
        ];
        return $out;
    }

    public static function denormalize(array $public): array
    {
        return [
            'tipo' => $public['tipo'] ?? 'CELDA',
            'expresion_1' => (string) ($public['expresion_1'] ?? ''),
            'operador' => (string) ($public['operador'] ?? '=='),
            'expresion_2' => $public['expresion_2'] ?? null,
            'severidad' => (string) ($public['severidad'] ?? 'REVISAR'),
            'mensaje' => (string) ($public['mensaje'] ?? ''),
            'omitir_si_ambos_cero' => !empty($public['omitir_si_ambos_cero']),
            'omitir_si_v1_es_cero' => !empty($public['omitir_si_v1_es_cero']),
            'validacion_exclusiva' => !empty($public['validacion_exclusiva']),
            'aplicar_a_tipo' => $public['aplicar_a_tipo'] ?? [],
            'excluir_tipo' => $public['excluir_tipo'] ?? [],
            'aplicar_a' => $public['aplicar_a'] ?? [],
            'establecimientos_excluidos' => $public['establecimientos_excluidos'] ?? [],
        ];
    }

    private static function bindPayload(array $payload, int $autor): array
    {
        $d = self::denormalize($payload);
        return [
            ':regla_id' => (string) ($payload['regla_id'] ?? ''),
            ':serie' => strtoupper((string) ($payload['serie'] ?? 'A')),
            ':rem_sheet' => (string) ($payload['rem_sheet'] ?? ''),
            ':tipo' => $d['tipo'],
            ':exp1' => $d['expresion_1'],
            ':op' => $d['operador'],
            ':exp2' => self::encodeExpresion2($d['expresion_2']),
            ':sev' => $d['severidad'],
            ':msg' => $d['mensaje'],
            ':o0' => $d['omitir_si_ambos_cero'] ? 1 : 0,
            ':o1' => $d['omitir_si_v1_es_cero'] ? 1 : 0,
            ':ve' => $d['validacion_exclusiva'] ? 1 : 0,
            ':aat' => json_encode(array_values($d['aplicar_a_tipo']), JSON_UNESCAPED_UNICODE),
            ':et' => json_encode(array_values($d['excluir_tipo']), JSON_UNESCAPED_UNICODE),
            ':aa' => json_encode(array_values($d['aplicar_a']), JSON_UNESCAPED_UNICODE),
            ':ee' => json_encode(array_values($d['establecimientos_excluidos']), JSON_UNESCAPED_UNICODE),
            ':autor' => $autor,
        ];
    }

    private static function bindUpdatePayload(array $payload, int $autor): array
    {
        // update NO acepta regla_id/serie/rem_sheet (vienen en la URL);
        // solo se actualizan los campos editables.
        $d = self::denormalize($payload);
        return [
            ':tipo' => $d['tipo'],
            ':exp1' => $d['expresion_1'],
            ':op' => $d['operador'],
            ':exp2' => self::encodeExpresion2($d['expresion_2']),
            ':sev' => $d['severidad'],
            ':msg' => $d['mensaje'],
            ':o0' => $d['omitir_si_ambos_cero'] ? 1 : 0,
            ':o1' => $d['omitir_si_v1_es_cero'] ? 1 : 0,
            ':ve' => $d['validacion_exclusiva'] ? 1 : 0,
            ':aat' => json_encode(array_values($d['aplicar_a_tipo']), JSON_UNESCAPED_UNICODE),
            ':et' => json_encode(array_values($d['excluir_tipo']), JSON_UNESCAPED_UNICODE),
            ':aa' => json_encode(array_values($d['aplicar_a']), JSON_UNESCAPED_UNICODE),
            ':ee' => json_encode(array_values($d['establecimientos_excluidos']), JSON_UNESCAPED_UNICODE),
            ':autor' => $autor,
            ':regla_id' => (string) ($payload['regla_id'] ?? ''),
        ];
    }

    private static function encodeExpresion2(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        return json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    private static function decodeExpresion2(?string $json): mixed
    {
        if ($json === null || $json === '') {
            return null;
        }
        $decoded = json_decode($json, true);
        return $decoded;
    }

    private static function decodeJsonArray(?string $json): array
    {
        if ($json === null || $json === '') {
            return [];
        }
        $decoded = json_decode($json, true);
        return is_array($decoded) ? $decoded : [];
    }
}
