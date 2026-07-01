<?php
declare(strict_types=1);

final class ReglaVersion
{
    /**
     * @return array{items: array<int, array>, total: int}
     */
    public static function list(int $page = 1, int $perPage = 20): array
    {
        $page = max(1, $page);
        $perPage = max(1, min(100, $perPage));
        $offset = ($page - 1) * $perPage;

        $pdo = db();
        $total = (int) $pdo->query('SELECT COUNT(*) FROM reglas_versiones')->fetchColumn();
        $stmt = $pdo->prepare('SELECT * FROM reglas_versiones ORDER BY publicado_en DESC LIMIT :lim OFFSET :off');
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();
        return ['items' => array_map([self::class, 'normalize'], $items), 'total' => $total];
    }

    public static function findLatest(): ?array
    {
        $stmt = db()->query('SELECT * FROM reglas_versiones ORDER BY publicado_en DESC LIMIT 1');
        $row = $stmt->fetch();
        return $row === false ? null : self::normalize($row);
    }

    public static function findByVersion(string $versionSemver): ?array
    {
        $stmt = db()->prepare('SELECT * FROM reglas_versiones WHERE version_semver = :v LIMIT 1');
        $stmt->execute([':v' => $versionSemver]);
        $row = $stmt->fetch();
        return $row === false ? null : self::normalize($row);
    }

    /**
     * Crea una nueva version a partir del draft actual de reglas activas.
     * @return array{version: array, semver: string, total: int}
     */
    public static function publish(int $autor, ?string $notas): array
    {
        $reglas = Regla::listActiveForSnapshot();
        $total = count($reglas);
        $semver = self::nextSemver();
        $payload = json_encode([
            'version_semver' => $semver,
            'publicado_en' => date('c'),
            'total_reglas' => $total,
            'reglas' => $reglas,
        ], JSON_UNESCAPED_UNICODE);
        $stmt = db()->prepare(
            'INSERT INTO reglas_versiones (version_semver, total_reglas, publicado_por, notas, payload_json)
             VALUES (:v, :t, :a, :n, :p)'
        );
        $stmt->execute([
            ':v' => $semver,
            ':t' => $total,
            ':a' => $autor,
            ':n' => $notas,
            ':p' => $payload,
        ]);
        return [
            'version' => self::findByVersion($semver),
            'semver' => $semver,
            'total' => $total,
        ];
    }

    public static function nextSemver(): string
    {
        $latest = self::findLatest();
        if (!$latest) {
            return '1.0.0-reglas';
        }
        $current = $latest['version_semver'];
        if (!preg_match('/^(\d+)\.(\d+)\.(\d+)-reglas$/', $current, $m)) {
            return '1.0.0-reglas';
        }
        $major = (int) $m[1];
        $minor = (int) $m[2];
        $patch = (int) $m[3] + 1;
        return sprintf('%d.%d.%d-reglas', $major, $minor, $patch);
    }

    public static function normalize(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'version_semver' => (string) $row['version_semver'],
            'total_reglas' => (int) $row['total_reglas'],
            'publicado_por' => (int) $row['publicado_por'],
            'publicado_en' => (string) $row['publicado_en'],
            'notas' => $row['notas'] ?? null,
        ];
    }
}
