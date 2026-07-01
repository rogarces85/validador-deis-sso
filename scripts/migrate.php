<?php
/**
 * Migracion idempotente del esquema del panel admin.
 *
 * Crea 5 tablas (usuarios_admin, reglas, reglas_versiones, reglas_audit,
 * audit_log) y una tabla auxiliar (rate_limit). Seguro de correr multiples
 * veces: usa CREATE TABLE IF NOT EXISTS y verifica columnas faltantes.
 *
 * Uso:
 *   php scripts/migrate.php            # crea BD si no existe y aplica migracion
 *   php scripts/migrate.php --no-db    # asume BD ya creada
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/api/bootstrap.php';

$createDb = !in_array('--no-db', $argv, true);

function column_exists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare(
        'SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t AND COLUMN_NAME = :c'
    );
    $stmt->execute([':t' => $table, ':c' => $column]);
    return $stmt->fetch() !== false;
}

$statements = [
    // 1) usuarios_admin
    'CREATE TABLE IF NOT EXISTS usuarios_admin (
        id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email           VARCHAR(120) UNIQUE NOT NULL,
        password_hash   VARCHAR(255) NOT NULL,
        nombre          VARCHAR(120) NOT NULL,
        activo          TINYINT(1) NOT NULL DEFAULT 1,
        ultimo_acceso   DATETIME NULL,
        creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // 2) reglas (borrador editable)
    'CREATE TABLE IF NOT EXISTS reglas (
        id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        regla_id        VARCHAR(40) NOT NULL,
        serie           CHAR(1) NOT NULL,
        rem_sheet       VARCHAR(20) NOT NULL,
        tipo            VARCHAR(20) NOT NULL DEFAULT "CELDA",
        expresion_1     VARCHAR(255) NOT NULL,
        operador        VARCHAR(5) NOT NULL,
        expresion_2     JSON NULL,
        severidad       ENUM("ERROR","REVISAR","INDICADOR") NOT NULL,
        mensaje         TEXT NOT NULL,
        omitir_si_ambos_cero      TINYINT(1) NOT NULL DEFAULT 0,
        omitir_si_v1_es_cero      TINYINT(1) NOT NULL DEFAULT 0,
        validacion_exclusiva      TINYINT(1) NOT NULL DEFAULT 0,
        aplicar_a_tipo            JSON NULL,
        excluir_tipo              JSON NULL,
        aplicar_a                 JSON NULL,
        establecimientos_excluidos JSON NULL,
        activo          TINYINT(1) NOT NULL DEFAULT 1,
        actualizado_por INT UNSIGNED NULL,
        actualizado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_regla_id (regla_id),
        INDEX idx_serie_sheet (serie, rem_sheet, activo),
        INDEX idx_actualizado_por (actualizado_por)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // 3) reglas_versiones (publicadas, inmutables)
    'CREATE TABLE IF NOT EXISTS reglas_versiones (
        id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        version_semver  VARCHAR(20) NOT NULL,
        total_reglas    INT UNSIGNED NOT NULL,
        publicado_por   INT UNSIGNED NOT NULL,
        publicado_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        notas           TEXT NULL,
        payload_json    LONGTEXT NOT NULL,
        UNIQUE KEY uk_version (version_semver)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // 4) reglas_audit (cambios sobre reglas)
    'CREATE TABLE IF NOT EXISTS reglas_audit (
        id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        regla_pk        BIGINT UNSIGNED NULL,
        regla_id        VARCHAR(40) NOT NULL,
        accion          ENUM("CREATE","UPDATE","DELETE","DEACTIVATE","PUBLISH") NOT NULL,
        diff_json       JSON NULL,
        autor           INT UNSIGNED NOT NULL,
        timestamp       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX idx_audit_regla (regla_id),
        INDEX idx_audit_autor (autor)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // 5) audit_log (uso del validador, no clinico)
    'CREATE TABLE IF NOT EXISTS audit_log (
        id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        timestamp       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        nombre_archivo  VARCHAR(255) NOT NULL,
        codigo_establecimiento VARCHAR(6) NOT NULL,
        nombre_establecimiento VARCHAR(160) NULL,
        comuna          VARCHAR(80) NULL,
        tipo_establecimiento   VARCHAR(20) NULL,
        serie           CHAR(1) NOT NULL,
        mes             CHAR(2) NOT NULL,
        periodo         CHAR(4) NULL,
        total_hallazgos INT UNSIGNED NOT NULL,
        conteo_error    INT UNSIGNED NOT NULL DEFAULT 0,
        conteo_revisar  INT UNSIGNED NOT NULL DEFAULT 0,
        conteo_indicador INT UNSIGNED NOT NULL DEFAULT 0,
        resultado_final ENUM("APROBADO","CON_OBSERVACIONES","RECHAZADO","ERROR") NOT NULL,
        duracion_ms     INT UNSIGNED NULL,
        ip_origen       VARCHAR(45) NULL,
        user_agent      VARCHAR(255) NULL,
        INDEX idx_log_codigo (codigo_establecimiento),
        INDEX idx_log_serie_mes (serie, mes),
        INDEX idx_log_fecha (timestamp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // 6) rate_limit (auxiliar)
    'CREATE TABLE IF NOT EXISTS rate_limit (
        kkey            VARCHAR(120) NOT NULL PRIMARY KEY,
        count           INT UNSIGNED NOT NULL DEFAULT 0,
        window_start    INT UNSIGNED NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
];

if ($createDb) {
    echo "[migrate] Verificando base de datos '" . env_or(ENV_DB_NAME, DB_NAME) . "'...\n";
    ensure_database_exists();
    echo "[migrate] Base de datos lista.\n";
}

$pdo = db();
$created = 0;
$existed = 0;
foreach ($statements as $sql) {
    try {
        $pdo->exec($sql);
        $created++;
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'Base table or view already exists')) {
            $existed++;
            continue;
        }
        throw $e;
    }
}

echo "[migrate] Sentencias ejecutadas: $created nuevas, $existed ya existentes.\n";
echo "[migrate] Esquema listo en '" . env_or(ENV_DB_NAME, DB_NAME) . "'.\n";
