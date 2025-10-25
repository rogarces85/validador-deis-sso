<?php
/**
 * Archivo de Configuración Central
 * Validador DEIS SSO 2025
 */

// Prevenir acceso directo
defined('APP_ACCESS') or die('Acceso denegado');

// ==================== CONFIGURACIÓN GENERAL ====================

define('APP_NAME', 'Validador DEIS SSO 2025');
define('APP_VERSION', '2.0');
define('APP_ENV', 'production'); // 'development' o 'production'

// ==================== RUTAS ====================

define('BASE_PATH', __DIR__ . '/..');
define('DATA_PATH', BASE_PATH . '/Datos');
define('LOG_PATH', BASE_PATH . '/logs');
define('RULES_FILE', BASE_PATH . '/rules.json');
define('ESTABLECIMIENTOS_FILE', BASE_PATH . '/establecimientos.txt');

// ==================== CONFIGURACIÓN DE ARCHIVOS ====================

define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB en bytes
define('ALLOWED_EXTENSIONS', ['xlsm', 'xlsx']);
define('ALLOWED_MIMES', [
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);

// ==================== CONFIGURACIÓN PHP ====================

ini_set('memory_limit', '512M');
set_time_limit(300); // 5 minutos
ini_set('max_execution_time', '300');

// Manejo de errores según entorno
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', LOG_PATH . '/php-errors.log');
}

// ==================== CONFIGURACIÓN DE VALIDACIÓN ====================

// Tolerancia para comparaciones de valores flotantes
define('FLOAT_COMPARISON_EPSILON', 0.0001);

// Tiempo de retención de archivos en días
define('FILE_RETENTION_DAYS', 30);

// ==================== CONFIGURACIÓN DE EXPORTACIÓN ====================

define('EXPORT_FILENAME_PREFIX', 'Vali');
define('EXPORT_SHEET_TITLE', 'Resultado Validación');

// ==================== COLORES DE SEVERIDAD ====================

define('SEVERITY_COLORS', [
    'ERROR' => 'FFF8D7DA',
    'REVISAR' => 'FFFFF3CD',
    'OBSERVAR' => 'FFE3F7FF',
    'INDICADOR' => 'FFE8F0FF'
]);

// ==================== CONFIGURACIÓN DE LOGS ====================

define('LOG_ENABLED', true);
define('LOG_LEVEL', APP_ENV === 'development' ? 'DEBUG' : 'ERROR');
define('LOG_MAX_SIZE', 10 * 1024 * 1024); // 10MB

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Registra un mensaje en el log
 */
function logMessage($message, $level = 'INFO') {
    if (!LOG_ENABLED) return;
    
    $logFile = LOG_PATH . '/app-' . date('Y-m-d') . '.log';
    
    // Crear directorio de logs si no existe
    if (!file_exists(LOG_PATH)) {
        mkdir(LOG_PATH, 0755, true);
    }
    
    // Rotar log si es muy grande
    if (file_exists($logFile) && filesize($logFile) > LOG_MAX_SIZE) {
        rename($logFile, $logFile . '.' . time() . '.old');
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] [{$level}] {$message}\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

/**
 * Retorna la configuración como array
 */
function getConfig() {
    return [
        'app' => [
            'name' => APP_NAME,
            'version' => APP_VERSION,
            'env' => APP_ENV
        ],
        'paths' => [
            'base' => BASE_PATH,
            'data' => DATA_PATH,
            'logs' => LOG_PATH,
            'rules' => RULES_FILE,
            'establecimientos' => ESTABLECIMIENTOS_FILE
        ],
        'files' => [
            'max_size' => MAX_FILE_SIZE,
            'allowed_extensions' => ALLOWED_EXTENSIONS,
            'allowed_mimes' => ALLOWED_MIMES,
            'retention_days' => FILE_RETENTION_DAYS
        ],
        'validation' => [
            'epsilon' => FLOAT_COMPARISON_EPSILON
        ],
        'export' => [
            'filename_prefix' => EXPORT_FILENAME_PREFIX,
            'sheet_title' => EXPORT_SHEET_TITLE
        ],
        'logging' => [
            'enabled' => LOG_ENABLED,
            'level' => LOG_LEVEL,
            'max_size' => LOG_MAX_SIZE
        ]
    ];
}

/**
 * Verifica que los directorios necesarios existan
 */
function checkDirectories() {
    $dirs = [DATA_PATH, LOG_PATH];
    
    foreach ($dirs as $dir) {
        if (!file_exists($dir)) {
            if (!mkdir($dir, 0755, true)) {
                logMessage("No se pudo crear el directorio: {$dir}", 'ERROR');
                return false;
            }
            logMessage("Directorio creado: {$dir}", 'INFO');
        }
    }
    
    return true;
}

/**
 * Limpia archivos antiguos del directorio de datos
 */
function cleanOldFiles() {
    if (!file_exists(DATA_PATH)) return 0;
    
    $count = 0;
    $cutoffTime = time() - (FILE_RETENTION_DAYS * 24 * 60 * 60);
    
    $files = glob(DATA_PATH . '/*.{xlsm,xlsx}', GLOB_BRACE);
    
    foreach ($files as $file) {
        if (filemtime($file) < $cutoffTime) {
            if (unlink($file)) {
                $count++;
                logMessage("Archivo eliminado: " . basename($file), 'INFO');
            }
        }
    }
    
    return $count;
}

/**
 * Retorna información del sistema
 */
function getSystemInfo() {
    return [
        'php_version' => PHP_VERSION,
        'memory_limit' => ini_get('memory_limit'),
        'max_execution_time' => ini_get('max_execution_time'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'temp_dir' => sys_get_temp_dir(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
    ];
}

// ==================== INICIALIZACIÓN ====================

// Verificar directorios al cargar la configuración
checkDirectories();

// Registrar carga de configuración
logMessage("Configuración cargada correctamente", 'INFO');
