<?php
declare(strict_types=1);

final class Response
{
    public static function json(int $status, array $payload): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-store, no-cache, must-revalidate, private');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public static function ok(array $data = []): void
    {
        self::json(200, array_merge(['ok' => true], $data));
    }

    public static function created(array $data = []): void
    {
        self::json(201, array_merge(['ok' => true], $data));
    }

    public static function fail(int $status, string $error, array $extra = []): void
    {
        self::json($status, array_merge(['ok' => false, 'error' => $error], $extra));
    }

    public static function method_not_allowed(array $allowed): void
    {
        header('Allow: ' . implode(', ', $allowed));
        self::fail(405, 'Metodo no permitido');
    }

    public static function not_found(): void
    {
        self::fail(404, 'Ruta no encontrada');
    }
}
