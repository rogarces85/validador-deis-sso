<?php
declare(strict_types=1);

/**
 * Bootstrap del backend PHP.
 *
 * - Conexion PDO singleton a MySQL.
 * - Sesion PHP segura (HttpOnly, SameSite=Strict, Strict mode).
 * - Encabezados JSON por defecto.
 * - Carga de helpers (Response, Validator, Csrf) y middleware.
 *
 * Variables de entorno (todas con fallback a defaults de XAMPP):
 *   DB_HOST     default 127.0.0.1
 *   DB_PORT     default 3306
 *   DB_NAME     default validador_deis_admin
 *   DB_USER     default root
 *   DB_PASS     default vacio
 *   SESSION_NAME default deis_admin_session
 *   SESSION_LIFETIME segundos, default 1800 (30 min)
 *   CORS_ORIGIN default * (en produccion restringir al mismo origen)
 */

require_once __DIR__ . '/lib/Response.php';
require_once __DIR__ . '/lib/Validator.php';
require_once __DIR__ . '/lib/Csrf.php';
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/middleware/ratelimit.php';
require_once __DIR__ . '/middleware/auth.php';
require_once __DIR__ . '/models/UsuarioAdmin.php';
require_once __DIR__ . '/controllers/HealthController.php';
require_once __DIR__ . '/controllers/AuthController.php';

const DB_HOST = '127.0.0.1';
const DB_PORT = '3306';
const DB_NAME = 'validador_deis_admin';
const DB_USER = 'root';
const DB_PASS = '';
const SESSION_NAME = 'deis_admin_session';
const SESSION_LIFETIME = 1800;
const CORS_ORIGIN = ''; // vacio = mismo origen (recomendado)
const ENV_DB_HOST = 'DB_HOST';
const ENV_DB_PORT = 'DB_PORT';
const ENV_DB_NAME = 'DB_NAME';
const ENV_DB_USER = 'DB_USER';
const ENV_DB_PASS = 'DB_PASS';
const ENV_SESSION_NAME = 'SESSION_NAME';
const ENV_SESSION_LIFETIME = 'SESSION_LIFETIME';
const ENV_CORS_ORIGIN = 'CORS_ORIGIN';

function env_or(string $name, string $default): string
{
    $val = getenv($name);
    if ($val === false || $val === '') {
        return $default;
    }
    return $val;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            env_or(ENV_DB_HOST, DB_HOST),
            env_or(ENV_DB_PORT, DB_PORT),
            env_or(ENV_DB_NAME, DB_NAME)
        );
        $pdo = new PDO($dsn, env_or(ENV_DB_USER, DB_USER), env_or(ENV_DB_PASS, DB_PASS), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    session_name(env_or(ENV_SESSION_NAME, SESSION_NAME));
    session_set_cookie_params([
        'lifetime' => (int) env_or(ENV_SESSION_LIFETIME, (string) SESSION_LIFETIME),
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.gc_maxlifetime', (string) env_or(ENV_SESSION_LIFETIME, (string) SESSION_LIFETIME));
    session_start();

    // Renovacion del token CSRF por sesion
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = Csrf::token();
    }
    if (empty($_SESSION['csrf_issued_at'])) {
        $_SESSION['csrf_issued_at'] = time();
    }
}

function base_path(): string
{
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    if (str_contains($script, '/api/')) {
        return substr($script, 0, (int) strpos($script, '/api/'));
    }
    return '';
}

function client_ip(): string
{
    $candidates = [
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null,
        $_SERVER['HTTP_X_REAL_IP'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
    ];
    foreach ($candidates as $c) {
        if (is_string($c) && $c !== '') {
            $ip = trim(explode(',', $c)[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '0.0.0.0';
}

function ensure_database_exists(): void
{
    $host = env_or(ENV_DB_HOST, DB_HOST);
    $port = env_or(ENV_DB_PORT, DB_PORT);
    $name = env_or(ENV_DB_NAME, DB_NAME);
    $user = env_or(ENV_DB_USER, DB_USER);
    $pass = env_or(ENV_DB_PASS, DB_PASS);
    $dsn = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $host, $port);
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $stmt = $pdo->prepare('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = :n');
    $stmt->execute([':n' => $name]);
    if (!$stmt->fetch()) {
        $pdo->exec(sprintf('CREATE DATABASE `%s` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', str_replace('`', '``', $name)));
    }
}
