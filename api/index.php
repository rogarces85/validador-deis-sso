<?php
declare(strict_types=1);

/**
 * Router del backend.
 *
 * Rutas publicas (sin auth):
 *   GET  /api/health
 *   GET  /api/auth/csrf
 *   POST /api/auth/login
 *
 * Rutas protegidas (RequireAuth + opcionalmente RequireCsrf):
 *   POST /api/auth/logout   (RequireAuth + RequireCsrf)
 *   GET  /api/auth/me       (RequireAuth)
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

CorsMiddleware::handle();
start_session();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

// Normalizar: quitar prefijos hasta /api/
$apiIdx = strpos($uri, '/api/');
if ($apiIdx === false) {
    Response::not_found();
    exit;
}
$path = substr($uri, $apiIdx);
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/api';
}

try {
    if ($path === '/api/health' && $method === 'GET') {
        HealthController::get();
        exit;
    }
    if ($path === '/api/auth/csrf' && $method === 'GET') {
        AuthController::csrf();
        exit;
    }
    if ($path === '/api/auth/login' && $method === 'POST') {
        AuthController::login();
        exit;
    }
    if ($path === '/api/auth/logout' && $method === 'POST') {
        AuthController::logout();
        exit;
    }
    if ($path === '/api/auth/me' && $method === 'GET') {
        AuthController::me();
        exit;
    }
    Response::not_found();
} catch (Throwable $e) {
    error_log('[api] ' . $e->getMessage() . ' @ ' . $path);
    Response::fail(500, 'Error interno del servidor');
}
