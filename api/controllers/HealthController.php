<?php
declare(strict_types=1);

final class HealthController
{
    public static function get(): void
    {
        try {
            $stmt = db()->query('SELECT 1 AS ok');
            $row = $stmt->fetch();
            if (!$row || (int) $row['ok'] !== 1) {
                Response::fail(503, 'BD no responde');
                return;
            }
            Response::ok([
                'service' => 'validador-deis-admin',
                'status' => 'ok',
                'time' => date('c'),
                'php' => PHP_VERSION,
            ]);
        } catch (Throwable $e) {
            Response::fail(503, 'BD no disponible: ' . $e->getMessage());
        }
    }
}
