<?php
declare(strict_types=1);

/**
 * CORS same-origin por defecto.
 * En dev, si CORS_ORIGIN esta definido, agrega el header para ese origen
 * (necesario cuando el frontend se sirve desde Vite dev server en otro puerto).
 */
final class CorsMiddleware
{
    public static function handle(): void
    {
        $origin = env_or(ENV_CORS_ORIGIN, CORS_ORIGIN);
        if ($origin === '') {
            return; // mismo origen, sin headers
        }
        $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($requestOrigin === $origin) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
            http_response_code(204);
            exit;
        }
    }
}
