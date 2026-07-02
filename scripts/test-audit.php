<?php
/**
 * Tests del modulo de auditoria no clinica.
 * Cubre 8 escenarios:
 *   1) POST /api/audit publico con payload valido
 *   2) POST /api/audit con campos prohibidos -> 400
 *   3) POST /api/audit con payload malformado -> 400
 *   4) GET /api/audit sin auth -> 401
 *   5) GET /api/audit admin -> 200 con items y paginacion
 *   6) GET /api/audit/estadisticas admin -> 200 con agregaciones
 *   7) POST /api/audit con periodo valido (YYYY) -> 201
 *   8) POST /api/audit con duracion opcional ausente -> 201
 *
 * Uso:
 *   php scripts/test-audit.php --base=http://localhost/validador-deis-sso
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/api/bootstrap.php';

$base = 'http://localhost/validador-deis-sso';
foreach ($argv as $a) {
    if (str_starts_with($a, '--base=')) {
        $base = substr($a, 7);
    }
}

const TEST_EMAIL = 'admin@test.local';
const TEST_PASSWORD = 'test1234';

$pass = 0;
$fail = 0;

function http(string $method, string $url, ?array $body = null, ?string $cookie = null, ?string $csrf = null): array
{
    $ch = curl_init($url);
    $headers = ['Accept: application/json'];
    if ($cookie !== null) $headers[] = 'Cookie: ' . $cookie;
    if ($csrf !== null) $headers[] = 'X-CSRF-Token: ' . $csrf;
    if ($body !== null) $headers[] = 'Content-Type: application/json';
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
    preg_match_all('/^Set-Cookie:\s*([^=]+)=([^;]*)/mi', $headersOut, $m, PREG_SET_ORDER);
    $latest = [];
    foreach ($m as $c) {
        $name = trim($c[1]);
        $val = trim($c[2]);
        if ($val === '' || strtolower($val) === 'deleted') continue;
        $latest[$name] = $val;
    }
    $setCookie = [];
    foreach ($latest as $n => $v) {
        $setCookie[] = $n . '=' . $v;
    }
    return [
        'status' => (int) $code,
        'json' => json_decode((string) $bodyOut, true),
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

echo "=== Tests de auditoria (base: $base) ===\n\n";
ensure_test_admin();
RateLimiter::reset('audit', '127.0.0.1');
RateLimiter::reset('audit', '::1');
RateLimiter::reset('login', '127.0.0.1');
RateLimiter::reset('login', '::1');

// 0) Login admin
echo "0) POST /api/auth/login\n";
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => TEST_PASSWORD]);
check('login OK', $r['status'] === 200);
$sessionCookie = implode('; ', $r['cookies']);
$csrf = $r['json']['csrf_token'] ?? null;

// 1) POST valido
echo "\n1) POST /api/audit (publico, payload valido)\n";
$payload = [
    'nombre_archivo' => 'test.xlsm',
    'codigo_establecimiento' => '123010',
    'nombre_establecimiento' => 'Hospital Osorno',
    'comuna' => 'OSORNO',
    'tipo_establecimiento' => 'HOSPITAL',
    'serie' => 'A',
    'mes' => '06',
    'periodo' => '2026',
    'total_hallazgos' => 5,
    'conteo_error' => 1,
    'conteo_revisar' => 2,
    'conteo_indicador' => 2,
    'resultado_final' => 'CON_OBSERVACIONES',
    'duracion_ms' => 1500,
];
$r = http('POST', $base . '/api/audit', $payload);
check('publico responde 201', $r['status'] === 201, "status={$r['status']} body={$r['raw']}");
check('ok=true', ($r['json']['ok'] ?? null) === true);
check('id presente', is_int($r['json']['id'] ?? null));

// 2) POST con campos prohibidos (lista blanca)
echo "\n2) POST /api/audit con campos prohibidos -> 400\n";
$bad = $payload;
$bad['valor_celda'] = 'A1';
$bad['contenido_hoja'] = 'SECRETO';
$bad['nombre_archivo'] = 'test-bad.xlsm';
$r = http('POST', $base . '/api/audit', $bad);
check('rechaza campos prohibidos', $r['status'] === 400, "status={$r['status']}");
check('mensaje menciona lista blanca', str_contains((string) ($r['json']['error'] ?? ''), 'lista blanca'));

// 3) POST con payload malformado
echo "\n3) POST /api/audit con payload malformado -> 400\n";
$r = http('POST', $base . '/api/audit', ['foo' => 'bar']);
check('rechaza payload sin campos requeridos', $r['status'] === 400);

// 4) POST con serie invalida
echo "\n4) POST /api/audit con serie invalida -> 400\n";
$bad2 = $payload;
$bad2['serie'] = 'X';
$bad2['nombre_archivo'] = 'test-serie-bad.xlsm';
$r = http('POST', $base . '/api/audit', $bad2);
check('rechaza serie invalida', $r['status'] === 400);

// 5) GET /api/audit sin auth
echo "\n5) GET /api/audit sin auth -> 401\n";
$r = http('GET', $base . '/api/audit');
check('GET sin auth -> 401', $r['status'] === 401);

// 6) GET /api/audit admin
echo "\n6) GET /api/audit admin -> 200\n";
$r = http('GET', $base . '/api/audit', null, $sessionCookie);
check('GET admin -> 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");
check('items es array', is_array($r['json']['items'] ?? null));
check('total >= 1', ($r['json']['total'] ?? 0) >= 1);
check('paginacion presente', is_int($r['json']['page'] ?? null) && is_int($r['json']['perPage'] ?? null));

// 7) GET /api/audit con filtros
echo "\n7) GET /api/audit?serie=A\n";
$r = http('GET', $base . '/api/audit?serie=A&page=1&perPage=10', null, $sessionCookie);
check('GET filtrado -> 200', $r['status'] === 200);
check('todos los items son serie A', array_reduce(
    ($r['json']['items'] ?? []),
    fn($carry, $item) => $carry && ($item['serie'] ?? '') === 'A',
    true
));

// 8) GET /api/audit/estadisticas
echo "\n8) GET /api/audit/estadisticas admin\n";
$r = http('GET', $base . '/api/audit/estadisticas', null, $sessionCookie);
check('estadisticas -> 200', $r['status'] === 200);
check('total presente', is_int($r['json']['total'] ?? null));
check('por_serie es array', is_array($r['json']['por_serie'] ?? null));
check('por_establecimiento es array', is_array($r['json']['por_establecimiento'] ?? null));
check('tasa_aprobacion es float', is_float($r['json']['tasa_aprobacion'] ?? null) || is_int($r['json']['tasa_aprobacion'] ?? null));

// 9) POST con duracion ausente
echo "\n9) POST /api/audit sin duracion_ms -> 201 (opcional)\n";
$sinDur = $payload;
unset($sinDur['duracion_ms']);
$sinDur['nombre_archivo'] = 'test-sin-dur.xlsm';
$r = http('POST', $base . '/api/audit', $sinDur);
check('acepta payload sin duracion', $r['status'] === 201, "status={$r['status']} body={$r['raw']}");

// 10) GET /api/audit/estadisticas con filtro serie
echo "\n10) GET /api/audit/estadisticas?serie=A\n";
$r = http('GET', $base . '/api/audit/estadisticas?serie=A', null, $sessionCookie);
check('estadisticas filtrado -> 200', $r['status'] === 200);

echo "\nResumen: $pass OK, $fail FAIL\n";
exit($fail === 0 ? 0 : 1);
