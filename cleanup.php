<?php
/**
 * Script de Limpieza y Mantenimiento
 * Validador DEIS SSO 2025
 * 
 * Ejecutar manualmente o mediante cron:
 * 0 2 * * * /usr/bin/php /ruta/al/proyecto/cleanup.php
 */

// Solo permitir ejecución desde CLI o con token secreto
if (php_sapi_name() !== 'cli') {
    $token = $_GET['token'] ?? '';
    $expectedToken = 'TU_TOKEN_SECRETO_AQUI'; // Cambiar por un token seguro
    
    if ($token !== $expectedToken) {
        http_response_code(403);
        die('Acceso denegado');
    }
}

// Definir constante de acceso
define('APP_ACCESS', true);

// Cargar configuración
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/functions.php';

// Iniciar log de limpieza
$logFile = LOG_PATH . '/cleanup-' . date('Y-m-d') . '.log';
$startTime = microtime(true);

logToFile($logFile, "==========================================");
logToFile($logFile, "Inicio de limpieza: " . date('Y-m-d H:i:s'));
logToFile($logFile, "==========================================\n");

/**
 * Función auxiliar para logging
 */
function logToFile($file, $message) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($file, "[{$timestamp}] {$message}\n", FILE_APPEND);
    echo "[{$timestamp}] {$message}\n";
}

// ====================
// 1. LIMPIAR ARCHIVOS ANTIGUOS
// ====================

logToFile($logFile, "\n1. Limpiando archivos Excel antiguos...");

$deletedFiles = 0;
$errorFiles = 0;
$cutoffDate = time() - (FILE_RETENTION_DAYS * 24 * 60 * 60);

if (is_dir(DATA_PATH)) {
    $files = glob(DATA_PATH . '/*.{xlsm,xlsx}', GLOB_BRACE);
    
    foreach ($files as $file) {
        $fileAge = time() - filemtime($file);
        $fileDays = round($fileAge / (24 * 60 * 60));
        
        if (filemtime($file) < $cutoffDate) {
            if (unlink($file)) {
                $deletedFiles++;
                logToFile($logFile, "  ✓ Eliminado: " . basename($file) . " (antigüedad: {$fileDays} días)");
            } else {
                $errorFiles++;
                logToFile($logFile, "  ✗ Error al eliminar: " . basename($file));
            }
        }
    }
    
    logToFile($logFile, "Total archivos eliminados: {$deletedFiles}");
    if ($errorFiles > 0) {
        logToFile($logFile, "Archivos con errores: {$errorFiles}");
    }
} else {
    logToFile($logFile, "  ! Directorio de datos no existe");
}

// ====================
// 2. ROTAR LOGS ANTIGUOS
// ====================

logToFile($logFile, "\n2. Rotando logs antiguos...");

$rotatedLogs = 0;
$logRetentionDays = 90; // 3 meses
$logCutoffDate = time() - ($logRetentionDays * 24 * 60 * 60);

if (is_dir(LOG_PATH)) {
    $logFiles = glob(LOG_PATH . '/*.log');
    
    foreach ($logFiles as $log) {
        // Saltar el log actual de limpieza
        if (basename($log) === basename($logFile)) {
            continue;
        }
        
        $logAge = time() - filemtime($log);
        $logDays = round($logAge / (24 * 60 * 60));
        
        // Eliminar logs muy antiguos
        if (filemtime($log) < $logCutoffDate) {
            if (unlink($log)) {
                $rotatedLogs++;
                logToFile($logFile, "  ✓ Eliminado log: " . basename($log) . " (antigüedad: {$logDays} días)");
            }
        }
        // Comprimir logs de más de 30 días
        elseif ($logAge > (30 * 24 * 60 * 60) && !strpos($log, '.gz')) {
            if (function_exists('gzopen')) {
                $gzFile = $log . '.gz';
                if (compressFile($log, $gzFile)) {
                    unlink($log);
                    logToFile($logFile, "  ✓ Comprimido log: " . basename($log));
                    $rotatedLogs++;
                }
            }
        }
    }
    
    logToFile($logFile, "Total logs procesados: {$rotatedLogs}");
} else {
    logToFile($logFile, "  ! Directorio de logs no existe");
}

// ====================
// 3. LIMPIAR CACHE (SI EXISTE)
// ====================

logToFile($logFile, "\n3. Limpiando cache...");

$cachePath = BASE_PATH . '/cache';
if (is_dir($cachePath)) {
    $cacheFiles = glob($cachePath . '/*');
    $deletedCache = 0;
    
    foreach ($cacheFiles as $cacheFile) {
        if (is_file($cacheFile)) {
            if (unlink($cacheFile)) {
                $deletedCache++;
            }
        }
    }
    
    logToFile($logFile, "Archivos de cache eliminados: {$deletedCache}");
} else {
    logToFile($logFile, "  Sin directorio de cache");
}

// ====================
// 4. OPTIMIZAR DIRECTORIOS
// ====================

logToFile($logFile, "\n4. Verificando estructura de directorios...");

$requiredDirs = [
    DATA_PATH => 'Datos',
    LOG_PATH => 'Logs',
    BASE_PATH . '/assets' => 'Assets'
];

foreach ($requiredDirs as $dir => $name) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            logToFile($logFile, "  ✓ Creado directorio: {$name}");
        } else {
            logToFile($logFile, "  ✗ Error al crear directorio: {$name}");
        }
    } else {
        logToFile($logFile, "  ✓ Directorio OK: {$name}");
    }
}

// ====================
// 5. VERIFICAR PERMISOS
// ====================

logToFile($logFile, "\n5. Verificando permisos de archivos...");

$directoriosEscritura = [DATA_PATH, LOG_PATH];
$permisosOK = true;

foreach ($directoriosEscritura as $dir) {
    if (is_dir($dir)) {
        if (is_writable($dir)) {
            logToFile($logFile, "  ✓ Permisos OK: " . basename($dir));
        } else {
            logToFile($logFile, "  ✗ Sin permisos de escritura: " . basename($dir));
            $permisosOK = false;
        }
    }
}

// ====================
// 6. ESTADÍSTICAS DEL SISTEMA
// ====================

logToFile($logFile, "\n6. Estadísticas del sistema:");

// Espacio en disco
$diskFree = disk_free_space(BASE_PATH);
$diskTotal = disk_total_space(BASE_PATH);
$diskUsed = $diskTotal - $diskFree;
$diskPercent = round(($diskUsed / $diskTotal) * 100, 2);

logToFile($logFile, "  Espacio en disco:");
logToFile($logFile, "    - Total: " . formatBytes($diskTotal));
logToFile($logFile, "    - Usado: " . formatBytes($diskUsed) . " ({$diskPercent}%)");
logToFile($logFile, "    - Libre: " . formatBytes($diskFree));

// Tamaño del directorio de datos
$dataSize = getDirSize(DATA_PATH);
logToFile($logFile, "  Tamaño directorio Datos: " . formatBytes($dataSize));

// Tamaño del directorio de logs
$logsSize = getDirSize(LOG_PATH);
logToFile($logFile, "  Tamaño directorio Logs: " . formatBytes($logsSize));

// Memoria PHP
logToFile($logFile, "  Uso de memoria PHP: " . formatBytes(memory_get_usage(true)));

// ====================
// 7. VALIDAR ARCHIVOS DE CONFIGURACIÓN
// ====================

logToFile($logFile, "\n7. Validando archivos de configuración...");

$configFiles = [
    RULES_FILE => 'Reglas de validación',
    ESTABLECIMIENTOS_FILE => 'Establecimientos'
];

foreach ($configFiles as $file => $name) {
    if (file_exists($file)) {
        $size = filesize($file);
        logToFile($logFile, "  ✓ {$name}: " . formatBytes($size));
    } else {
        logToFile($logFile, "  ✗ {$name}: NO ENCONTRADO");
    }
}

// ====================
// RESUMEN FINAL
// ====================

$executionTime = round(microtime(true) - $startTime, 2);

logToFile($logFile, "\n==========================================");
logToFile($logFile, "RESUMEN DE LIMPIEZA:");
logToFile($logFile, "==========================================");
logToFile($logFile, "Archivos Excel eliminados: {$deletedFiles}");
logToFile($logFile, "Logs procesados: {$rotatedLogs}");
logToFile($logFile, "Tiempo de ejecución: {$executionTime}s");
logToFile($logFile, "Estado: " . ($permisosOK ? "✓ EXITOSO" : "⚠ CON ADVERTENCIAS"));
logToFile($logFile, "==========================================\n");

// ====================
// FUNCIONES AUXILIARES
// ====================

/**
 * Calcula el tamaño de un directorio recursivamente
 */
function getDirSize($directory) {
    $size = 0;
    
    if (!is_dir($directory)) {
        return 0;
    }
    
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
        $size += $file->getSize();
    }
    
    return $size;
}

/**
 * Comprime un archivo usando gzip
 */
function compressFile($source, $destination) {
    $bufferSize = 4096;
    
    $sourceFile = fopen($source, 'rb');
    $destFile = gzopen($destination, 'wb9');
    
    if (!$sourceFile || !$destFile) {
        return false;
    }
    
    while (!feof($sourceFile)) {
        gzwrite($destFile, fread($sourceFile, $bufferSize));
    }
    
    fclose($sourceFile);
    gzclose($destFile);
    
    return file_exists($destination);
}

// Finalizar
logMessage("Limpieza completada exitosamente", 'INFO');

// Si se ejecuta desde web, mostrar mensaje
if (php_sapi_name() !== 'cli') {
    echo "<h2>Limpieza completada</h2>";
    echo "<p>Archivos eliminados: {$deletedFiles}</p>";
    echo "<p>Logs procesados: {$rotatedLogs}</p>";
    echo "<p>Tiempo: {$executionTime}s</p>";
    echo "<p><a href='index.php'>Volver</a></p>";
}
