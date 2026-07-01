<?php
/**
 * Tests del CRUD de reglas y publicacion de versiones.
 * Asume que el admin de pruebas ya esta sembrado (admin@test.local / test1234).
 *
 * Uso:
 *   php scripts/test-reglas.php --base=http://localhost/validador-deis-sso
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

echo "=== Tests de reglas (base: $base) ===\n\n";
ensure_test_admin();
RateLimiter::reset('login', '127.0.0.1');
RateLimiter::reset('login', '::1');

// 0) Login
echo "0) POST /api/auth/login\n";
$r = http('POST', $base . '/api/auth/login', ['email' => TEST_EMAIL, 'password' => TEST_PASSWORD]);
check('login OK', $r['status'] === 200);
$sessionCookie = implode('; ', $r['cookies']);
$csrf = $r['json']['csrf_token'] ?? null;
check('csrf_token presente', is_string($csrf));

// 1) Listar reglas
echo "\n1) GET /api/reglas\n";
$r = http('GET', $base . '/api/reglas', null, $sessionCookie);
check('listar responde 200', $r['status'] === 200);
check('items es array', is_array($r['json']['items'] ?? null));
check('total >= 0', is_int($r['json']['total'] ?? null));
$totalInicial = (int) ($r['json']['total'] ?? 0);
echo "  total reglas activas: $totalInicial\n";

// 2) Listar sin auth
echo "\n2) GET /api/reglas sin auth -> 401\n";
$r = http('GET', $base . '/api/reglas');
check('sin auth -> 401', $r['status'] === 401);

// 3) GET /api/reglas/actual publico
echo "\n3) GET /api/reglas/actual (publico)\n";
$r = http('GET', $base . '/api/reglas/actual');
check('actual responde 200', $r['status'] === 200);
check('payload version_semver presente', is_string($r['json']['version_semver'] ?? null));
check('payload.total_reglas >= 0', is_int($r['json']['total_reglas'] ?? null));

// 4) Crear regla
echo "\n4) POST /api/reglas (crear)\n";
$nuevaId = 'TEST-VAL' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
$payload = [
    'regla_id' => $nuevaId,
    'serie' => 'A',
    'rem_sheet' => 'A01',
    'tipo' => 'CELDA',
    'expresion_1' => 'F11',
    'operador' => '==',
    'expresion_2' => 0,
    'severidad' => 'REVISAR',
    'mensaje' => 'Test: F11 debe ser distinto de 0',
    'omitir_si_ambos_cero' => false,
    'omitir_si_v1_es_cero' => false,
    'validacion_exclusiva' => false,
    'aplicar_a_tipo' => [],
    'excluir_tipo' => [],
    'aplicar_a' => [],
    'establecimientos_excluidos' => [],
];
$r = http('POST', $base . '/api/reglas', $payload, $sessionCookie, $csrf);
check('crear -> 201', $r['status'] === 201, "status={$r['status']} body={$r['raw']}");
check('regla devuelta con regla_id', ($r['json']['regla']['regla_id'] ?? null) === $nuevaId);

// 5) Crear duplicado -> 409
echo "\n5) POST /api/reglas duplicado -> 409\n";
$r = http('POST', $base . '/api/reglas', $payload, $sessionCookie, $csrf);
check('duplicado -> 409', $r['status'] === 409);

// 6) Validacion: payload invalido -> 400
echo "\n6) POST /api/reglas con payload invalido -> 400\n";
$bad = $payload;
$bad['regla_id'] = 'TEST-BAD-9999';
$bad['severidad'] = 'INVALIDA';
$r = http('POST', $base . '/api/reglas', $bad, $sessionCookie, $csrf);
check('payload invalido -> 400', $r['status'] === 400);

// 7) Editar regla
echo "\n7) PUT /api/reglas/:id (editar)\n";
$edit = $payload;
$edit['mensaje'] = 'Editado: ' . date('Y-m-d H:i:s');
$r = http('PUT', $base . '/api/reglas/' . $nuevaId, $edit, $sessionCookie, $csrf);
check('editar -> 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");
check('mensaje actualizado', ($r['json']['regla']['mensaje'] ?? null) === $edit['mensaje']);

// 8) Desactivar regla
echo "\n8) DELETE /api/reglas/:id (desactivar)\n";
$r = http('DELETE', $base . '/api/reglas/' . $nuevaId, null, $sessionCookie, $csrf);
check('desactivar -> 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");
check('activo=false', ($r['json']['regla']['activo'] ?? null) === false);

// 9) Reactivar
echo "\n9) POST /api/reglas/:id/activar (reactivar)\n";
$r = http('POST', $base . '/api/reglas/' . $nuevaId . '/activar', null, $sessionCookie, $csrf);
check('activar -> 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");
check('activo=true', ($r['json']['regla']['activo'] ?? null) === true);

// 10) Publicar
echo "\n10) POST /api/reglas/publicar (publicar)\n";
$semverAntes = $r = http('GET', $base . '/api/reglas/actual', null, null);
$semverAntes = $semverAntes['json']['version_semver'] ?? null;
$r = http('POST', $base . '/api/reglas/publicar', ['notas' => 'Test publicacion'], $sessionCookie, $csrf);
check('publicar -> 200', $r['status'] === 200, "status={$r['status']} body={$r['raw']}");
$semverDespues = $r['json']['semver'] ?? null;
check('semver nuevo distinto del anterior', $semverDespues !== $semverAntes);

// 11) Versiones
echo "\n11) GET /api/reglas/versiones (historial)\n";
$r = http('GET', $base . '/api/reglas/versiones', null, $sessionCookie);
check('versiones -> 200', $r['status'] === 200);
check('items es array', is_array($r['json']['items'] ?? null));
$encontrado = false;
foreach (($r['json']['items'] ?? []) as $v) {
    if (($v['version_semver'] ?? '') === $semverDespues) {
        $encontrado = true;
        break;
    }
}
check('version recien publicada aparece en historial', $encontrado);

// 12) Publico: GET /api/reglas/actual refleja nueva publicacion
echo "\n12) GET /api/reglas/actual refleja la nueva publicacion\n";
$r = http('GET', $base . '/api/reglas/actual');
check('version_semver publico = nuevo', ($r['json']['version_semver'] ?? null) === $semverDespues);

echo "\nResumen: $pass OK, $fail FAIL\n";
exit($fail === 0 ? 0 : 1);
