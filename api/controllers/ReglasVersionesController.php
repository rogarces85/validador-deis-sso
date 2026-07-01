<?php
declare(strict_types=1);

final class ReglasVersionesController
{
    public static function versiones(): void
    {
        AuthMiddleware::requireAuth();
        $page = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['perPage'] ?? 20);
        $result = ReglaVersion::list($page, $perPage);
        Response::ok([
            'items' => $result['items'],
            'total' => $result['total'],
            'page' => $page,
            'perPage' => $perPage,
            'totalPages' => (int) ceil($result['total'] / $perPage),
        ]);
    }

    public static function publicar(): void
    {
        $admin = AuthMiddleware::requireAuth();
        AuthMiddleware::requireCsrf();
        $body = Csrf::readJsonBody();
        $notas = is_array($body) && isset($body['notas']) && is_string($body['notas'])
            ? substr(trim($body['notas']), 0, 1000)
            : null;
        $total = Regla::countActive();
        if ($total === 0) {
            Response::fail(400, 'No hay reglas activas para publicar');
            return;
        }
        $result = ReglaVersion::publish((int) $admin['id'], $notas);
        ReglasAudit::record(
            (int) $admin['id'],
            'PUBLISH',
            '__release__',
            null,
            [
                'version_semver' => $result['semver'],
                'total_reglas' => $result['total'],
                'notas' => $notas,
            ]
        );
        Response::ok([
            'version' => $result['version'],
            'semver' => $result['semver'],
            'total_reglas' => $result['total'],
        ]);
    }

    public static function actual(): void
    {
        // Endpoint PUBLICO: no requiere auth ni CSRF. La constitucion v1.2.0
        // define este contrato en la seccion 'Auditoria Opcional'.
        $latest = ReglaVersion::findLatest();
        if (!$latest) {
            Response::fail(404, 'No hay versiones publicadas');
            return;
        }
        $row = db()->prepare('SELECT * FROM reglas_versiones WHERE version_semver = :v');
        $row->execute([':v' => $latest['version_semver']]);
        $full = $row->fetch();
        $payload = $full ? json_decode((string) $full['payload_json'], true) : null;
        Response::ok([
            'version_semver' => $latest['version_semver'],
            'total_reglas' => $latest['total_reglas'],
            'publicado_en' => $latest['publicado_en'],
            'payload' => $payload,
        ]);
    }
}
