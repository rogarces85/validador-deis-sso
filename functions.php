<?php
/**
 * Funciones Auxiliares Reutilizables
 * Validador DEIS SSO 2025
 */

// Prevenir acceso directo
defined('APP_ACCESS') or die('Acceso denegado');

/**
 * Sanitiza y valida un nombre de archivo
 * 
 * @param string $filename Nombre del archivo
 * @return string Nombre sanitizado
 */
function sanitizeFilename($filename) {
    // Remover caracteres peligrosos
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
    
    // Prevenir directory traversal
    $filename = basename($filename);
    
    // Limitar longitud
    if (strlen($filename) > 255) {
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        $name = substr(pathinfo($filename, PATHINFO_FILENAME), 0, 250);
        $filename = $name . '.' . $ext;
    }
    
    return $filename;
}

/**
 * Valida la estructura del nombre de archivo REM
 * 
 * @param string $filename Nombre del archivo
 * @return array|false Array con [codigo, serie, mes] o false si inválido
 */
function validateRemFilename($filename) {
    // Patrón: 6 dígitos + letras + 2 dígitos + extensión
    if (!preg_match('/^(\d{6})([A-Z]+)(\d{2})\.(xlsm|xlsx)$/i', $filename, $matches)) {
        return false;
    }
    
    $codigo = $matches[1];
    $serie = strtoupper($matches[2]);
    $mes = $matches[3];
    
    // Validar mes (01-12)
    if ((int)$mes < 1 || (int)$mes > 12) {
        return false;
    }
    
    return [
        'codigo' => $codigo,
        'serie' => $serie,
        'mes' => $mes,
        'valido' => true
    ];
}

/**
 * Formatea bytes a formato legible
 * 
 * @param int $bytes Tamaño en bytes
 * @param int $precision Decimales de precisión
 * @return string Tamaño formateado
 */
function formatBytes($bytes, $precision = 2) {
    if ($bytes <= 0) return '0 Bytes';
    
    $units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    $pow = floor(log($bytes) / log(1024));
    $pow = min($pow, count($units) - 1);
    
    return round($bytes / (1024 ** $pow), $precision) . ' ' . $units[$pow];
}

/**
 * Valida tipo MIME de un archivo
 * 
 * @param string $filepath Ruta del archivo
 * @param array $allowedMimes Tipos MIME permitidos
 * @return bool
 */
function validateMimeType($filepath, $allowedMimes = ALLOWED_MIMES) {
    if (!file_exists($filepath)) {
        return false;
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $filepath);
    finfo_close($finfo);
    
    return in_array($mimeType, $allowedMimes);
}

/**
 * Genera un nombre único para archivo
 * 
 * @param string $directory Directorio destino
 * @param string $filename Nombre original
 * @return string Nombre único
 */
function generateUniqueFilename($directory, $filename) {
    $targetPath = $directory . '/' . $filename;
    
    if (!file_exists($targetPath)) {
        return $filename;
    }
    
    $pathinfo = pathinfo($filename);
    $basename = $pathinfo['filename'];
    $extension = $pathinfo['extension'];
    
    $counter = 1;
    do {
        $newFilename = $basename . '_' . time() . '_' . $counter . '.' . $extension;
        $targetPath = $directory . '/' . $newFilename;
        $counter++;
    } while (file_exists($targetPath));
    
    return $newFilename;
}

/**
 * Carga y parsea el archivo de establecimientos
 * 
 * @param string $filepath Ruta al archivo
 * @return array Mapa código => nombre
 */
function loadEstablecimientos($filepath = ESTABLECIMIENTOS_FILE) {
    $map = [];
    
    if (!file_exists($filepath)) {
        logMessage("Archivo de establecimientos no encontrado: {$filepath}", 'WARNING');
        return $map;
    }
    
    $contenido = file_get_contents($filepath);
    $patron = '/"(?P<cod>\d{6})"\s*=>\s*\[\s*"nombre"\s*=>\s*"(?P<nom>[^"]+)"/u';
    
    if (preg_match_all($patron, $contenido, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $nombre = $match['nom'];
            
            // Asegurar UTF-8
            if (!mb_check_encoding($nombre, 'UTF-8')) {
                $nombre = mb_convert_encoding($nombre, 'UTF-8', 'Windows-1252');
            }
            
            $map[$match['cod']] = trim($nombre);
        }
    }
    
    logMessage("Cargados " . count($map) . " establecimientos", 'INFO');
    return $map;
}

/**
 * Carga las reglas de validación desde JSON
 * 
 * @param string $filepath Ruta al archivo de reglas
 * @return array|false Reglas o false en caso de error
 */
function loadValidationRules($filepath = RULES_FILE) {
    if (!file_exists($filepath)) {
        logMessage("Archivo de reglas no encontrado: {$filepath}", 'ERROR');
        return false;
    }
    
    $jsonContent = file_get_contents($filepath);
    $rules = json_decode($jsonContent, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        logMessage("Error al parsear JSON de reglas: " . json_last_error_msg(), 'ERROR');
        return false;
    }
    
    if (!isset($rules['validaciones']) || !is_array($rules['validaciones'])) {
        logMessage("Estructura de reglas inválida", 'ERROR');
        return false;
    }
    
    $totalReglas = 0;
    foreach ($rules['validaciones'] as $sheet => $reglas) {
        $totalReglas += count($reglas);
    }
    
    logMessage("Cargadas {$totalReglas} reglas de validación", 'INFO');
    return $rules;
}

/**
 * Convierte texto con encoding problemático a UTF-8
 * 
 * @param string $text Texto a convertir
 * @return string Texto en UTF-8
 */
function toUtf8($text) {
    if (mb_check_encoding($text, 'UTF-8')) {
        return $text;
    }
    
    // Intentar diferentes encodings
    $encodings = ['Windows-1252', 'ISO-8859-1', 'CP1252'];
    
    foreach ($encodings as $encoding) {
        $converted = @mb_convert_encoding($text, 'UTF-8', $encoding);
        if ($converted && mb_check_encoding($converted, 'UTF-8')) {
            return $converted;
        }
    }
    
    // Como último recurso
    return utf8_encode($text);
}

/**
 * Renderiza un mensaje de error en HTML
 * 
 * @param string $title Título del error
 * @param string $message Mensaje de error
 * @param int $code Código HTTP
 */
function renderError($title, $message, $code = 500) {
    http_response_code($code);
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title><?= htmlspecialchars($title) ?> - DEIS SSO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="d-flex align-items-center justify-content-center" style="min-height:100vh; background:#f8fafc;">
        <div class="card shadow-sm" style="max-width:600px;">
            <div class="card-header bg-danger text-white">
                <h5 class="mb-0">⚠️ <?= htmlspecialchars($title) ?></h5>
            </div>
            <div class="card-body">
                <p class="mb-3"><?= nl2br(htmlspecialchars($message)) ?></p>
                <a href="index.php" class="btn btn-primary">Volver al inicio</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

/**
 * Retorna información de depuración
 * 
 * @return array
 */
function getDebugInfo() {
    return [
        'timestamp' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'memory_usage' => formatBytes(memory_get_usage(true)),
        'peak_memory' => formatBytes(memory_get_peak_usage(true)),
        'execution_time' => round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 3) . 's',
        'loaded_extensions' => get_loaded_extensions()
    ];
}

/**
 * Escapa HTML de manera segura
 * 
 * @param string $text Texto a escapar
 * @return string Texto escapado
 */
function e($text) {
    return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Verifica si una regla aplica a un establecimiento
 * 
 * @param array $regla Regla de validación
 * @param string $codigo Código del establecimiento
 * @return bool
 */
function reglAplicaAEstablecimiento($regla, $codigo) {
    // Si no tiene restricciones, aplica a todos
    if (!isset($regla['aplicar_a']) || empty($regla['aplicar_a'])) {
        return true;
    }
    
    // Si tiene establecimientos_excluidos
    if (isset($regla['establecimientos_excluidos'])) {
        return !in_array($codigo, $regla['establecimientos_excluidos']);
    }
    
    // Si tiene aplicar_a
    return in_array($codigo, $regla['aplicar_a']);
}

/**
 * Formatea un número con separadores de miles
 * 
 * @param float $number Número a formatear
 * @param int $decimals Decimales
 * @return string
 */
function formatNumber($number, $decimals = 2) {
    return number_format($number, $decimals, ',', '.');
}

/**
 * Retorna el mes en español
 * 
 * @param int|string $mes Número del mes (01-12)
 * @return string Nombre del mes
 */
function getMesNombre($mes) {
    $meses = [
        '01' => 'Enero', '02' => 'Febrero', '03' => 'Marzo',
        '04' => 'Abril', '05' => 'Mayo', '06' => 'Junio',
        '07' => 'Julio', '08' => 'Agosto', '09' => 'Septiembre',
        '10' => 'Octubre', '11' => 'Noviembre', '12' => 'Diciembre'
    ];
    
    return $meses[str_pad($mes, 2, '0', STR_PAD_LEFT)] ?? 'Desconocido';
}

/**
 * Genera un token CSRF
 * 
 * @return string Token generado
 */
function generateCsrfToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Valida un token CSRF
 * 
 * @param string $token Token a validar
 * @return bool
 */
function validateCsrfToken($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Registra una validación en el historial (para futura implementación con BD)
 * 
 * @param array $data Datos de la validación
 * @return bool
 */
function registrarValidacion($data) {
    // TODO: Implementar cuando se agregue base de datos
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'archivo' => $data['archivo'] ?? '',
        'codigo' => $data['codigo'] ?? '',
        'total_reglas' => $data['total_reglas'] ?? 0,
        'total_errores' => $data['total_errores'] ?? 0,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    logMessage("Validación registrada: " . json_encode($logData), 'INFO');
    return true;
}
