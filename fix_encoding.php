<?php
/**
 * Script para Corregir Encoding UTF-8
 * Ejecutar una sola vez para corregir establecimientos.txt
 * 
 * Uso: php fix_encoding.php
 * O desde navegador: http://localhost/validador/fix_encoding.php?token=TU_TOKEN
 */

// Token de seguridad (cambiar por uno seguro)
$requiredToken = 'fix2025';

if (php_sapi_name() !== 'cli') {
    $token = $_GET['token'] ?? '';
    if ($token !== $requiredToken) {
        http_response_code(403);
        die('Acceso denegado. Token inválido.');
    }
}

echo "==========================================\n";
echo "Script de Corrección de Encoding UTF-8\n";
echo "==========================================\n\n";

$archivoOriginal = __DIR__ . '/establecimientos.txt';
$archivoBackup = __DIR__ . '/establecimientos_backup_' . date('YmdHis') . '.txt';

// Verificar que existe el archivo
if (!file_exists($archivoOriginal)) {
    die("❌ ERROR: No se encontró el archivo establecimientos.txt\n");
}

// Crear backup
echo "📦 Creando backup...\n";
if (copy($archivoOriginal, $archivoBackup)) {
    echo "✅ Backup creado: " . basename($archivoBackup) . "\n\n";
} else {
    die("❌ ERROR: No se pudo crear el backup\n");
}

// Leer contenido
$contenido = file_get_contents($archivoOriginal);
$tamanoOriginal = strlen($contenido);

echo "📄 Analizando archivo...\n";
echo "   Tamaño: " . number_format($tamanoOriginal) . " bytes\n";

// Detectar encoding actual
$encodings = ['UTF-8', 'ISO-8859-1', 'Windows-1252', 'CP1252', 'ASCII'];
$encodingDetectado = mb_detect_encoding($contenido, $encodings, true);

echo "   Encoding detectado: " . ($encodingDetectado ?: 'Desconocido') . "\n";

// Contar caracteres problemáticos antes
$caracteresProblematicos = [
    'Ã±' => 'ñ',
    'Ã©' => 'é',
    'Ã¡' => 'á',
    'Ã­' => 'í',
    'Ã³' => 'ó',
    'Ãº' => 'ú',
    'Ã' => 'Ñ',
    'Ã‰' => 'É',
    'Ã' => 'Á',
    'Ã' => 'Í',
    'Ã"' => 'Ó',
    'Ãš' => 'Ú',
    'Ã¼' => 'ü',
    'Ãœ' => 'Ü'
];

$erroresEncontrados = 0;
foreach ($caracteresProblematicos as $malo => $bueno) {
    $count = substr_count($contenido, $malo);
    if ($count > 0) {
        $erroresEncontrados += $count;
        echo "   ⚠️  Encontrados {$count} caracteres '{$malo}' (debería ser '{$bueno}')\n";
    }
}

if ($erroresEncontrados === 0) {
    echo "   ✅ No se encontraron caracteres problemáticos\n";
}

echo "\n🔧 Corrigiendo encoding...\n";

// Método 1: Detectar y convertir
if ($encodingDetectado && $encodingDetectado !== 'UTF-8') {
    echo "   → Convirtiendo de {$encodingDetectado} a UTF-8...\n";
    $contenidoCorregido = mb_convert_encoding($contenido, 'UTF-8', $encodingDetectado);
} else {
    $contenidoCorregido = $contenido;
}

// Método 2: Corregir caracteres mal codificados manualmente
foreach ($caracteresProblematicos as $malo => $bueno) {
    if (strpos($contenidoCorregido, $malo) !== false) {
        $contenidoCorregido = str_replace($malo, $bueno, $contenidoCorregido);
        echo "   → Reemplazados '{$malo}' por '{$bueno}'\n";
    }
}

// Verificar si es UTF-8 válido ahora
if (mb_check_encoding($contenidoCorregido, 'UTF-8')) {
    echo "   ✅ Contenido es UTF-8 válido\n";
} else {
    echo "   ⚠️  Contenido tiene problemas de UTF-8, aplicando limpieza...\n";
    $contenidoCorregido = mb_convert_encoding($contenidoCorregido, 'UTF-8', 'UTF-8');
}

// Normalizar saltos de línea a Unix (LF)
$contenidoCorregido = str_replace(["\r\n", "\r"], "\n", $contenidoCorregido);

// Agregar BOM UTF-8 para asegurar reconocimiento
$bom = "\xEF\xBB\xBF";
$contenidoFinal = $bom . $contenidoCorregido;

// Guardar archivo corregido
echo "\n💾 Guardando archivo corregido...\n";
if (file_put_contents($archivoOriginal, $contenidoFinal)) {
    $tamanoNuevo = strlen($contenidoFinal);
    echo "   ✅ Archivo guardado exitosamente\n";
    echo "   Tamaño nuevo: " . number_format($tamanoNuevo) . " bytes\n";
    echo "   Diferencia: " . ($tamanoNuevo - $tamanoOriginal) . " bytes\n";
} else {
    die("\n❌ ERROR: No se pudo guardar el archivo corregido\n");
}

// Verificar el resultado
echo "\n🔍 Verificando resultado...\n";
$verificacion = file_get_contents($archivoOriginal);
$encodingFinal = mb_detect_encoding($verificacion, $encodings, true);

echo "   Encoding final: " . $encodingFinal . "\n";

// Contar establecimientos
preg_match_all('/"(\d{6})"\s*=>\s*\[\s*"nombre"\s*=>\s*"([^"]+)"/', $verificacion, $matches);
$totalEstablecimientos = count($matches[1]);

echo "   Establecimientos encontrados: {$totalEstablecimientos}\n";

// Mostrar algunos ejemplos
if ($totalEstablecimientos > 0) {
    echo "\n📋 Ejemplos de establecimientos corregidos:\n";
    for ($i = 0; $i < min(5, $totalEstablecimientos); $i++) {
        $codigo = $matches[1][$i];
        $nombre = $matches[2][$i];
        echo "   {$codigo} → {$nombre}\n";
    }
}

// Buscar caracteres problemáticos restantes
$problemasRestantes = 0;
foreach ($caracteresProblematicos as $malo => $bueno) {
    if (strpos($verificacion, $malo) !== false) {
        $problemasRestantes++;
        echo "   ⚠️  Aún quedan caracteres '{$malo}'\n";
    }
}

echo "\n==========================================\n";
if ($problemasRestantes === 0 && $encodingFinal === 'UTF-8') {
    echo "✅ CORRECCIÓN EXITOSA\n";
    echo "==========================================\n";
    echo "\nEl archivo establecimientos.txt ahora está en UTF-8 correcto.\n";
    echo "Backup guardado en: " . basename($archivoBackup) . "\n";
    echo "\n✨ Puedes eliminar el backup si todo funciona correctamente.\n";
} else {
    echo "⚠️  CORRECCIÓN PARCIAL\n";
    echo "==========================================\n";
    echo "\nSe detectaron algunos problemas restantes.\n";
    echo "Revisa manualmente el archivo o contacta a soporte.\n";
    echo "El backup está en: " . basename($archivoBackup) . "\n";
}

// Mostrar estadísticas de caracteres especiales encontrados
echo "\n📊 Estadísticas de caracteres especiales:\n";
$caracteresEspeciales = ['ñ', 'á', 'é', 'í', 'ó', 'ú', 'Ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'ü', 'Ü'];
foreach ($caracteresEspeciales as $char) {
    $count = mb_substr_count($verificacion, $char);
    if ($count > 0) {
        echo "   '{$char}': {$count}\n";
    }
}

// Si se ejecuta desde navegador, mostrar HTML
if (php_sapi_name() !== 'cli') {
    echo "\n\n<br><br>";
    echo "<a href='index.php' style='padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;'>Volver al Validador</a>";
}

echo "\n";
