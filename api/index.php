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

    // Endpoints publicos de reglas (sin auth)
    if ($path === '/api/reglas/actual' && $method === 'GET') {
        ReglasVersionesController::actual();
        exit;
    }

    // Auditoria no clinica (POST publico, GET admin)
    if ($path === '/api/audit' && $method === 'POST') {
        AuditController::create();
        exit;
    }
    if ($path === '/api/audit' && $method === 'GET') {
        AuditController::list();
        exit;
    }
    if ($path === '/api/audit/estadisticas' && $method === 'GET') {
        AuditController::stats();
        exit;
    }

    // CRUD de reglas (RequireAuth, opcionalmente RequireCsrf)
    if ($path === '/api/reglas' && $method === 'GET') {
        ReglasController::list();
        exit;
    }
    if ($path === '/api/reglas' && $method === 'POST') {
        ReglasController::create();
        exit;
    }
    if ($path === '/api/reglas/publicar' && $method === 'POST') {
        ReglasVersionesController::publicar();
        exit;
    }
    if ($path === '/api/reglas/versiones' && $method === 'GET') {
        ReglasVersionesController::versiones();
        exit;
    }
    if (preg_match('#^/api/reglas/([^/]+)$#', $path, $m)) {
        $reglaId = urldecode($m[1]);
        if ($method === 'GET') {
            ReglasController::get(['regla_id' => $reglaId]);
            exit;
        }
        if ($method === 'PUT') {
            ReglasController::update(['regla_id' => $reglaId]);
            exit;
        }
        if ($method === 'DELETE') {
            ReglasController::deactivate(['regla_id' => $reglaId]);
            exit;
        }
    }
    if (preg_match('#^/api/reglas/([^/]+)/activar$#', $path, $m)) {
        if ($method === 'POST') {
            ReglasController::activate(['regla_id' => urldecode($m[1])]);
            exit;
        }
    }

    Response::not_found();
} catch (Throwable $e) {
    error_log('[api] ' . $e->getMessage() . ' @ ' . $path);
    Response::fail(500, 'Error interno del servidor');
}
