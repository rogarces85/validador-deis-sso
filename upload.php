<?php
/**
 * Script de carga de archivos Excel para validación DEIS SSO
 * Maneja la subida segura de archivos .xlsm y .xlsx
 */

// Prevenir acceso directo sin POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Método no permitido']));
}

// Configuración
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_EXTENSIONS', ['xlsm', 'xlsx']);
$targetDir = __DIR__ . "/Datos/";

// Crear directorio si no existe
if (!file_exists($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        die(json_encode(['error' => 'No se pudo crear el directorio de datos']));
    }
}

// Validar que se recibió el archivo
if (!isset($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
    die(json_encode(['error' => 'No se recibió ningún archivo']));
}

$file = $_FILES['file'];

// Validar errores de carga
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por el servidor',
        UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido',
        UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
        UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
        UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en disco',
        UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la carga'
    ];
    $errorMsg = $errorMessages[$file['error']] ?? 'Error desconocido al subir el archivo';
    die(json_encode(['error' => $errorMsg]));
}

// Validar tamaño
if ($file['size'] > MAX_FILE_SIZE) {
    die(json_encode(['error' => 'El archivo excede el tamaño máximo de 50MB']));
}

// Validar extensión
$fileName = basename($file['name']);
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($fileExt, ALLOWED_EXTENSIONS)) {
    die(json_encode(['error' => 'Solo se permiten archivos .xlsm o .xlsx']));
}

// Validar tipo MIME
$allowedMimes = [
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedMimes)) {
    die(json_encode(['error' => 'El tipo de archivo no es válido']));
}

// Generar nombre único para evitar sobrescrituras
$targetFile = $targetDir . $fileName;

// Si existe, agregar timestamp
if (file_exists($targetFile)) {
    $nameWithoutExt = pathinfo($fileName, PATHINFO_FILENAME);
    $fileName = $nameWithoutExt . '_' . time() . '.' . $fileExt;
    $targetFile = $targetDir . $fileName;
}

// Mover archivo
if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    header("Location: validar_excel.php?file=" . urlencode($fileName));
    exit;
} else {
    http_response_code(500);
    die(json_encode(['error' => 'Error al guardar el archivo. Verifique los permisos del directorio']));
}
