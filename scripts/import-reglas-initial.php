<?php
/**
 * Importa las reglas desde data/reglas_finales.json a la BD y crea la
 * primera publicacion (1.0.0-reglas). La ejecucion es idempotente a menos
 * que se pase --reset, en cuyo caso limpia las tablas reglas,
 * reglas_versiones y reglas_audit antes de reimportar.
 *
 * Uso:
 *   php scripts/import-reglas-initial.php
 *   php scripts/import-reglas-initial.php --reset
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/api/bootstrap.php';

$reset = in_array('--reset', $argv, true);

$jsonPath = $root . '/data/reglas_finales.json';
if (!is_file($jsonPath)) {
    fwrite(STDERR, "No se encontro $jsonPath\n");
    exit(1);
}

$raw = file_get_contents($jsonPath);
if ($raw === false) {
    fwrite(STDERR, "No se pudo leer $jsonPath\n");
    exit(1);
}
$decoded = json_decode($raw, true);
if (!is_array($decoded)) {
    fwrite(STDERR, "reglas_finales.json no es JSON valido\n");
    exit(1);
}

// Validar estructura minima
$expectedKeyPattern = '/^[AP][A-Z0-9]+$/i';
$totalReglas = 0;
$reglas = [];
foreach ($decoded as $hoja => $items) {
    if (!preg_match($expectedKeyPattern, (string) $hoja)) {
        fwrite(STDERR, "Clave de hoja invalida en JSON: $hoja\n");
        exit(1);
    }
    $serie = strtoupper(substr((string) $hoja, 0, 1));
    if (!in_array($serie, ['A', 'P'], true)) {
        fwrite(STDERR, "Serie invalida en clave $hoja (debe empezar con A o P)\n");
        exit(1);
    }
    if (!is_array($items)) {
        fwrite(STDERR, "Las reglas de $hoja no son un array\n");
        exit(1);
    }
    foreach ($items as $idx => $r) {
        if (!is_array($r)) {
            fwrite(STDERR, "Regla #$idx de $hoja no es un objeto\n");
            exit(1);
        }
        // Algunos JSON de origen (P7) tienen reglas con descripcion_expresion_1
        // en lugar de expresion_1 concreto. Las saltamos con warning en vez
        // de abortar toda la importacion.
        $hasExpr1 = !empty($r['expresion_1']) || !empty($r['descripcion_expresion_1']);
        if (!$hasExpr1) {
            fwrite(STDERR, "[import] Aviso: $hoja[$idx] sin expresion_1 ni descripcion_expresion_1, se omite\n");
            continue;
        }
        // Si no hay expresion_1 concreto, usamos un placeholder generico.
        // El admin debera revisarlo en el panel antes de publicar.
        if (empty($r['expresion_1'])) {
            $r['expresion_1'] = 'A1';
        }
        // Truncar expresiones demasiado largas (>255 chars) con warning.
        // La columna expresion_1 esta dimensionada a 255; las reglas con
        // expresiones gigantes (>500 chars) suelen ser compuestas que el
        // motor no parsea y conviene revisarlas manualmente.
        $e1 = (string) $r['expresion_1'];
        if (mb_strlen($e1) > 255) {
            fwrite(STDERR, "[import] Aviso: $hoja[$idx] expresion_1 muy larga (" . mb_strlen($e1) . " chars), se trunca a 255\n");
            $r['expresion_1'] = mb_substr($e1, 0, 255);
        }
        $required = ['id', 'rem_sheet', 'operador', 'severidad', 'mensaje'];
        foreach ($required as $k) {
            if (!array_key_exists($k, $r)) {
                fwrite(STDERR, "Regla #$idx de $hoja sin campo obligatorio '$k'\n");
                exit(1);
            }
        }
        if (empty($r['severidad'])) {
            fwrite(STDERR, "[import] Aviso: $hoja[$idx] sin severidad, se omite\n");
            continue;
        }
        $r['serie'] = $serie;
        $r['rem_sheet'] = strtoupper((string) ($r['rem_sheet'] ?? $hoja));
        $reglas[] = $r;
        $totalReglas++;
    }
}

echo "[import] Reglas detectadas en JSON: $totalReglas\n";

$pdo = db();
$pdo->beginTransaction();
try {
    if ($reset) {
        echo "[import] --reset: limpiando tablas reglas, reglas_versiones y reglas_audit\n";
        $pdo->exec('DELETE FROM reglas_audit');
        $pdo->exec('DELETE FROM reglas_versiones');
        $pdo->exec('DELETE FROM reglas');
    }

    // Verificar si ya hay reglas cargadas
    $existing = (int) $pdo->query('SELECT COUNT(*) FROM reglas')->fetchColumn();
    if ($existing > 0 && !$reset) {
        echo "[import] Ya hay $existing reglas cargadas. Use --reset para reimportar desde cero.\n";
        $pdo->commit();
        exit(0);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO reglas (
            regla_id, serie, rem_sheet, tipo, expresion_1, operador, expresion_2,
            severidad, mensaje,
            omitir_si_ambos_cero, omitir_si_v1_es_cero, validacion_exclusiva,
            aplicar_a_tipo, excluir_tipo, aplicar_a, establecimientos_excluidos,
            activo
        ) VALUES (
            :regla_id, :serie, :rem_sheet, :tipo, :exp1, :op, :exp2,
            :sev, :msg,
            :o0, :o1, :ve,
            :aat, :et, :aa, :ee,
            1
        )'
    );

    $inserted = 0;
    foreach ($reglas as $r) {
        $stmt->execute([
            ':regla_id' => (string) $r['id'],
            ':serie' => (string) $r['serie'],
            ':rem_sheet' => (string) $r['rem_sheet'],
            ':tipo' => (string) ($r['tipo'] ?? 'CELDA'),
            ':exp1' => (string) $r['expresion_1'],
            ':op' => (string) $r['operador'],
            ':exp2' => isset($r['expresion_2']) ? json_encode($r['expresion_2'], JSON_UNESCAPED_UNICODE) : null,
            ':sev' => (string) $r['severidad'],
            ':msg' => (string) $r['mensaje'],
            ':o0' => !empty($r['omitir_si_ambos_cero']) ? 1 : 0,
            ':o1' => !empty($r['omitir_si_v1_es_cero']) ? 1 : 0,
            ':ve' => !empty($r['validacion_exclusiva']) ? 1 : 0,
            ':aat' => json_encode($r['aplicar_a_tipo'] ?? [], JSON_UNESCAPED_UNICODE),
            ':et' => json_encode($r['excluir_tipo'] ?? [], JSON_UNESCAPED_UNICODE),
            ':aa' => json_encode($r['aplicar_a'] ?? [], JSON_UNESCAPED_UNICODE),
            ':ee' => json_encode($r['establecimientos_excluidos'] ?? [], JSON_UNESCAPED_UNICODE),
        ]);
        $inserted++;
    }
    echo "[import] Reglas insertadas: $inserted\n";

    // Crear la primera publicacion (1.0.0-reglas)
    $publishResult = ReglaVersion::publish(0, 'Carga inicial desde data/reglas_finales.json');
    echo "[import] Primera publicacion creada: {$publishResult['semver']} ({$publishResult['total']} reglas)\n";

    $pdo->commit();
    echo "[import] Listo.\n";
} catch (Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, "[import] Error: " . $e->getMessage() . "\n");
    exit(1);
}
