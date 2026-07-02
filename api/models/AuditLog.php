<?php
declare(strict_types=1);

final class AuditLog
{
    public const RESULTADOS = ['APROBADO', 'CON_OBSERVACIONES', 'RECHAZADO', 'ERROR'];

    /**
     * Crea un evento de auditoria. El timestamp lo pone el servidor.
     * @param array $payload payload validado por AuditQueueValidator
     * @return int id insertado
     */
    public static function create(array $payload, string $ip, string $userAgent): int
    {
        $stmt = db()->prepare(
            'INSERT INTO audit_log (
                nombre_archivo, codigo_establecimiento, nombre_establecimiento,
                comuna, tipo_establecimiento, serie, mes, periodo,
                total_hallazgos, conteo_error, conteo_revisar, conteo_indicador,
                resultado_final, duracion_ms,
                ip_origen, user_agent
            ) VALUES (
                :nombre, :codigo, :nombre_est,
                :comuna, :tipo_est, :serie, :mes, :periodo,
                :total, :ce, :cr, :ci,
                :resultado, :duracion,
                :ip, :ua
            )'
        );
        $stmt->execute([
            ':nombre' => (string) $payload['nombre_archivo'],
            ':codigo' => (string) $payload['codigo_establecimiento'],
            ':nombre_est' => isset($payload['nombre_establecimiento']) ? (string) $payload['nombre_establecimiento'] : null,
            ':comuna' => isset($payload['comuna']) ? (string) $payload['comuna'] : null,
            ':tipo_est' => isset($payload['tipo_establecimiento']) ? (string) $payload['tipo_establecimiento'] : null,
            ':serie' => (string) $payload['serie'],
            ':mes' => (string) $payload['mes'],
            ':periodo' => isset($payload['periodo']) ? (string) $payload['periodo'] : null,
            ':total' => (int) $payload['total_hallazgos'],
            ':ce' => (int) ($payload['conteo_error'] ?? 0),
            ':cr' => (int) ($payload['conteo_revisar'] ?? 0),
            ':ci' => (int) ($payload['conteo_indicador'] ?? 0),
            ':resultado' => (string) $payload['resultado_final'],
            ':duracion' => isset($payload['duracion_ms']) ? (int) $payload['duracion_ms'] : null,
            ':ip' => $ip,
            ':ua' => $userAgent !== '' ? substr($userAgent, 0, 255) : null,
        ]);
        return (int) db()->lastInsertId();
    }

    /**
     * Lista eventos con filtros y paginacion.
     * @return array{items: array<int, array>, total: int}
     */
    public static function list(array $filtros, int $page = 1, int $perPage = 50): array
    {
        $page = max(1, $page);
        $perPage = max(1, min(200, $perPage));
        $offset = ($page - 1) * $perPage;

        [$whereSql, $params] = self::buildWhere($filtros);

        $pdo = db();
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM audit_log $whereSql");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $sql = "SELECT * FROM audit_log $whereSql ORDER BY timestamp DESC LIMIT :lim OFFSET :off";
        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return ['items' => $stmt->fetchAll(), 'total' => $total];
    }

    /**
     * Calcula estadisticas agregadas.
     * @return array{
     *   total: int,
     *   por_serie: array<int, array{serie: string, total: int}>,
     *   por_establecimiento: array<int, array{codigo: string, nombre: string, total: int}>,
     *   tasa_aprobacion: float
     * }
     */
    public static function stats(array $filtros): array
    {
        [$whereSql, $params] = self::buildWhere($filtros);
        $pdo = db();

        $total = (int) $pdo->prepare("SELECT COUNT(*) FROM audit_log $whereSql")
            ->execute($params) ? (int) $pdo->prepare("SELECT COUNT(*) FROM audit_log $whereSql")
            ->execute($params) : 0;
        // PDO->execute devuelve bool; rehacemos limpio:
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM audit_log $whereSql");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        // por_serie
        $stmtSerie = $pdo->prepare(
            "SELECT serie, COUNT(*) AS total FROM audit_log $whereSql GROUP BY serie ORDER BY total DESC"
        );
        $stmtSerie->execute($params);
        $porSerie = [];
        foreach ($stmtSerie->fetchAll() as $r) {
            $porSerie[] = ['serie' => (string) $r['serie'], 'total' => (int) $r['total']];
        }

        // por_establecimiento (top 10)
        $stmtEst = $pdo->prepare(
            "SELECT codigo_establecimiento, nombre_establecimiento, COUNT(*) AS total
             FROM audit_log $whereSql
             GROUP BY codigo_establecimiento, nombre_establecimiento
             ORDER BY total DESC LIMIT 10"
        );
        $stmtEst->execute($params);
        $porEst = [];
        foreach ($stmtEst->fetchAll() as $r) {
            $porEst[] = [
                'codigo' => (string) $r['codigo_establecimiento'],
                'nombre' => (string) ($r['nombre_establecimiento'] ?? ''),
                'total' => (int) $r['total'],
            ];
        }

        // tasa_aprobacion: APROBADO / (APROBADO + CON_OBSERVACIONES + RECHAZADO)
        // excluye ERROR (errores tecnicos, no validacion efectiva)
        $stmtAprob = $pdo->prepare(
            "SELECT
                SUM(CASE WHEN resultado_final = 'APROBADO' THEN 1 ELSE 0 END) AS aprobados,
                SUM(CASE WHEN resultado_final IN ('APROBADO','CON_OBSERVACIONES','RECHAZADO') THEN 1 ELSE 0 END) AS total_efectivos
             FROM audit_log $whereSql"
        );
        $stmtAprob->execute($params);
        $row = $stmtAprob->fetch();
        $aprobados = (int) ($row['aprobados'] ?? 0);
        $efectivos = (int) ($row['total_efectivos'] ?? 0);
        $tasaAprob = $efectivos > 0 ? round($aprobados / $efectivos, 4) : 0.0;

        return [
            'total' => $total,
            'por_serie' => $porSerie,
            'por_establecimiento' => $porEst,
            'tasa_aprobacion' => $tasaAprob,
        ];
    }

    private static function buildWhere(array $filtros): array
    {
        $where = [];
        $params = [];
        if (!empty($filtros['codigo_establecimiento'])) {
            $where[] = 'codigo_establecimiento = :codigo';
            $params[':codigo'] = (string) $filtros['codigo_establecimiento'];
        }
        if (!empty($filtros['serie']) && in_array($filtros['serie'], ['A', 'P'], true)) {
            $where[] = 'serie = :serie';
            $params[':serie'] = (string) $filtros['serie'];
        }
        if (!empty($filtros['mes']) && preg_match('/^\d{2}$/', (string) $filtros['mes'])) {
            $where[] = 'mes = :mes';
            $params[':mes'] = (string) $filtros['mes'];
        }
        if (!empty($filtros['resultado_final']) && in_array($filtros['resultado_final'], self::RESULTADOS, true)) {
            $where[] = 'resultado_final = :res';
            $params[':res'] = (string) $filtros['resultado_final'];
        }
        if (!empty($filtros['desde'])) {
            $where[] = 'timestamp >= :desde';
            $params[':desde'] = self::parseDate((string) $filtros['desde']) . ' 00:00:00';
        }
        if (!empty($filtros['hasta'])) {
            $where[] = 'timestamp <= :hasta';
            $params[':hasta'] = self::parseDate((string) $filtros['hasta']) . ' 23:59:59';
        }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
        return [$whereSql, $params];
    }

    private static function parseDate(string $date): string
    {
        $ts = strtotime($date);
        return $ts === false ? date('Y-m-d') : date('Y-m-d', $ts);
    }
}
