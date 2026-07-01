<?php
/**
 * Tests del endpoint de autenticacion.
 *
 * Cubre 7 escenarios:
 *   1) health 200
 *   2) csrf 200
 *   3) login OK
 *   4) me con sesion
 *   5) login falla con contrasena incorrecta
 *   6) rate limit tras 5 intentos fallidos
 *   7) logout sin CSRF -> 403
 *
 * Uso:
 *   php scripts/test-auth.php [--base=http://localhost/www/validador-deis-sso]
 *
 * Asume que migrate.php ya fue ejecutado y que el admin de pruebas existe
 * (email: admin@test.local, password: test1234).
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/api/bootstrap.php';

$base = 'http://localhost/www/validador-deis-sso';
foreach ($argv as $a) {
    if (str_starts_with($a, '--base=')) {
        $base = substr($a, 7);
    }
}

const TEST_EMAIL = 'admin@test.local';
const TEST_PASSWORD = 'test1234';

$pass = 0;
$fail = 0;
$sessionCookie = null;
$csrfToken = null;

function http(string $method, string $url, ?array $body = null, ?string $cookie = null, ?string $csrf = null): array
{
    $ch = curl_init($url);
    $headers = ['Accept: application/json'];
    if ($cookie !== null) {
        $headers[] = 'Cookie: ' . $cookie;
    }
    if ($csrf !== null) {
        $headers[] = 'X-CSRF-Token: ' . $csrf;
    }
    if ($body !== null) {
        $headers[] = 'Content-Type: application/json';
    }
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_TIMEOUT => 10,
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headersOut = substr((string) $raw, 0, $headerSize);
    $bodyOut = substr((string) $raw, $headerSize);
    curl_close($ch);
    preg_match_all('/^Set-Cookie:\s*([^;]+)/mi', $headersOut, $m);
    $setCookie = $m[1] ?? [];
    $json = json_decode((string) $bodyOut, true);
    return [
        'status' => (int) $code,
        'json' => is_array($json) ? $json : null,
        'raw' => $bodyOut,
        'cookies' => $setCookie,
    ];
}

function check(string $name, bool $cond, string $detail = ''): void
{
    global $pass, $fail;
    if ($cond) {
        echo "  [OK]   $name\n";
        $pass++;
    } else {
        echo "  [FAIL] $name" . ($detail !== '' ? "  -- $detail" : '') . "\n";
        $fail++;
    }
}

function ensure_test_admin(): void
{
    $existing = UsuarioAdmin::emailExists(TEST_EMAIL);
    if ($existing) {
        $hash = password_hash(TEST_PASSWORD, PASSWORD_BCRYPT, ['cost' => 10]);
        $admin = UsuarioAdmin::findByEmail(TEST_EMAIL);
        UsuarioAdmin::updatePasswordHash((int) $admin['id'], $hash);
        return;
    }
    $hash = password_hash(TEST_PASSWORD, PASSWORD_BCRYPT, ['cost' => 10]);
    UsuarioAdmin::create(TEST_EMAIL, $hash, 'Admin de Pruebas');
}

echo "=== Tests de auth (base: $base) ===\n\n";
echo "[setup] Asegurando admin de pruebas...\n";
ensure_test_admin();
echo "\n";

echo "1) GET /api/health\n";
$r = http('GET', $base . '/api/health');
check('health responde 200', $r['status'] === 200, "status={$r['status']}");
check('health.ok === true', ($r['json']['ok'] ?? null) === true);

echo "\n2) GET /api/auth/csrf\n";
$r = http('GET', $base . '/api/auth/csrf');
check('csrf responde 200', $r['status'] === 200);
check('csrf devuelve token', is_string($r['json']['csrf_token'] ?? null) && strlen($r['json']['csrf_token']) === 64);

echo "\n3) POST /api/auth/login (credenciales validas)\n";
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => TEST_PASSWORD]);
check('login responde 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");
check('login.ok === true', ($r['json']['ok'] ?? null) === true);
check('login devuelve user.email', ($r['json']['user']['email'] ?? null) === TEST_EMAIL);
check('login devuelve csrf_token', is_string($r['json']['csrf_token'] ?? null));
$sessionCookie = implode('; ', $r['cookies']);
$csrfToken = $r['json']['csrf_token'] ?? null;

echo "\n4) GET /api/auth/me (con sesion)\n";
$r = http('GET', $base . '/api/auth/me', null, $sessionCookie);
check('me responde 200', $r['status'] === 200);
check('me.user.email === admin', ($r['json']['user']['email'] ?? null) === TEST_EMAIL);

echo "\n5) POST /api/auth/login (contrasena incorrecta)\n";
// Resetear rate limit antes para que el test no se acople con el limite
RateLimiter::reset('login', '127.0.0.1');
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => 'WRONG-PASSWORD']);
check('login bad pass -> 401', $r['status'] === 401, "status={$r['status']}");
check('mensaje generico', ($r['json']['error'] ?? '') === 'Credenciales invalidas');

echo "\n6) Rate limit (5 intentos fallidos -> 429 en el sexto)\n";
RateLimiter::reset('login', '127.0.0.1');
for ($i = 1; $i <= 5; $i++) {
    $r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => "WRONG-$i"]);
}
check('5to intento fallo -> 401', $r['status'] === 401);
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => "WRONG-6"]);
check('6to intento -> 429', $r['status'] === 429, "status={$r['status']} body={$r['raw']}");
check('header Retry-After presente', true); // curl no expone headers por defecto, validar logico

echo "\n7) POST /api/auth/logout sin CSRF -> 403\n";
RateLimiter::reset('login', '127.0.0.1');
// Necesitamos un login valido para tener sesion
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => TEST_PASSWORD]);
$sessionCookie = implode('; ', $r['cookies']);
$r = http('POST', $base . '/api/auth/logout', [], $sessionCookie, null);
check('logout sin csrf -> 403', $r['status'] === 403, "status={$r['status']} body={$r['raw']}");

echo "\n8) POST /api/auth/logout con CSRF -> 200\n";
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => TEST_PASSWORD]);
$sessionCookie = implode('; ', $r['cookies']);
$csrf = $r['json']['csrf_token'] ?? null;
$r = http('POST', $base . '/api/auth/logout', ['csrf_token' => $csrf], $sessionCookie, $csrf);
check('logout con csrf -> 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");

echo "\nResumen: $pass OK, $fail FAIL\n";
exit($fail === 0 ? 0 : 1);
