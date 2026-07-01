<?php
declare(strict_types=1);

final class ReglasAudit
{
    public const ACCIONES = ['CREATE', 'UPDATE', 'DELETE', 'DEACTIVATE', 'ACTIVATE', 'PUBLISH'];

    public static function record(
        int $autor,
        string $accion,
        string $reglaId,
        ?int $reglaPk = null,
        ?array $diff = null
    ): int {
        $stmt = db()->prepare(
            'INSERT INTO reglas_audit (regla_pk, regla_id, accion, diff_json, autor)
             VALUES (:pk, :rid, :acc, :diff, :autor)'
        );
        $stmt->execute([
            ':pk' => $reglaPk,
            ':rid' => $reglaId,
            ':acc' => $accion,
            ':diff' => $diff === null ? null : json_encode($diff, JSON_UNESCAPED_UNICODE),
            ':autor' => $autor,
        ]);
        return (int) db()->lastInsertId();
    }

    /**
     * @return array{items: array<int, array>, total: int}
     */
    public static function list(int $page = 1, int $perPage = 50): array
    {
        $page = max(1, $page);
        $perPage = max(1, min(200, $perPage));
        $offset = ($page - 1) * $perPage;
        $pdo = db();
        $total = (int) $pdo->query('SELECT COUNT(*) FROM reglas_audit')->fetchColumn();
        $stmt = $pdo->prepare('SELECT * FROM reglas_audit ORDER BY timestamp DESC LIMIT :lim OFFSET :off');
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return ['items' => $stmt->fetchAll(), 'total' => $total];
    }
}
