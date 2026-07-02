<?php
declare(strict_types=1);

final class AuditController
{
    public const RATE_LIMIT_MAX = 1000;
    public const RATE_LIMIT_WINDOW = 3600; // 1 hora

    /**
     * POST /api/audit - PUBLICO (sin auth).
     * Recibe un evento de auditoria no clinica. La falla del endpoint
     * NO debe impedir que el validador termine (fire-and-forget desde
     * el cliente, retry con cola IndexedDB).
     */
    public static function create(): void
    {
        // Rate limit por IP (1000/h) - primero, antes de validar payload.
        $ip = client_ip();
        $rl = RateLimiter::hit('audit', $ip, self::RATE_LIMIT_MAX, self::RATE_LIMIT_WINDOW);
        if (!$rl['allowed']) {
            header('Retry-After: ' . (string) $rl['reset_in']);
            Response::fail(429, 'Demasiados eventos, reintente en ' . (string) $rl['reset_in'] . ' segundos');
            return;
        }

        $body = Csrf::readJsonBody();
        if (!is_array($body)) {
            Response::fail(400, 'Cuerpo JSON requerido');
            return;
        }

        try {
            $payload = AuditQueueValidator::validate($body);
        } catch (InvalidArgumentException $e) {
            Response::fail(400, $e->getMessage());
            return;
        }

        $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
        $id = AuditLog::create($payload, $ip, $ua);
        Response::created(['id' => $id]);
    }

    /**
     * GET /api/audit - ADMIN (RequireAuth).
     * Lista eventos con filtros y paginacion.
     */
    public static function list(): void
    {
        AuthMiddleware::requireAuth();
        $page = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['perPage'] ?? 50);
        $filtros = [
            'codigo_establecimiento' => $_GET['codigo_establecimiento'] ?? null,
            'serie' => $_GET['serie'] ?? null,
            'mes' => $_GET['mes'] ?? null,
            'resultado_final' => $_GET['resultado_final'] ?? null,
            'desde' => $_GET['desde'] ?? null,
            'hasta' => $_GET['hasta'] ?? null,
        ];
        $result = AuditLog::list($filtros, $page, $perPage);
        Response::ok([
            'items' => $result['items'],
            'total' => $result['total'],
            'page' => $page,
            'perPage' => $perPage,
            'totalPages' => (int) ceil($result['total'] / $perPage),
        ]);
    }

    /**
     * GET /api/audit/estadisticas - ADMIN (RequireAuth).
     * Devuelve agregaciones: total, por_serie, por_establecimiento, tasa_aprobacion.
     */
    public static function stats(): void
    {
        AuthMiddleware::requireAuth();
        $filtros = [
            'codigo_establecimiento' => $_GET['codigo_establecimiento'] ?? null,
            'serie' => $_GET['serie'] ?? null,
            'mes' => $_GET['mes'] ?? null,
            'resultado_final' => $_GET['resultado_final'] ?? null,
            'desde' => $_GET['desde'] ?? null,
            'hasta' => $_GET['hasta'] ?? null,
        ];
        $stats = AuditLog::stats($filtros);
        Response::ok($stats);
    }
}
