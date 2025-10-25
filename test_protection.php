<?php
/**
 * Script de Prueba de Protección de Celdas
 * Verifica qué celdas están protegidas en un archivo Excel
 * 
 * Uso: php test_protection.php archivo.xlsx
 * O desde navegador: test_protection.php?file=archivo.xlsx&token=test2025
 */

require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

// Configuración
$token = $_GET['token'] ?? '';
$requiredToken = 'test2025';

if (php_sapi_name() !== 'cli') {
    if ($token !== $requiredToken) {
        http_response_code(403);
        die('Acceso denegado. Token inválido.');
    }
    header('Content-Type: text/html; charset=UTF-8');
    echo "<pre>";
}

echo "==========================================\n";
echo "TEST DE PROTECCIÓN DE CELDAS\n";
echo "==========================================\n\n";

// Obtener archivo
if (php_sapi_name() === 'cli') {
    $file = $argv[1] ?? null;
    $filepath = $file;
} else {
    $file = $_GET['file'] ?? null;
    $filepath = __DIR__ . "/Datos/" . basename($file);
}

if (!$file) {
    die("❌ ERROR: Debe especificar un archivo\n\nUso:\n  CLI: php test_protection.php archivo.xlsx\n  Web: test_protection.php?file=archivo.xlsx&token=test2025\n");
}

if (!file_exists($filepath)) {
    die("❌ ERROR: Archivo no encontrado: {$file}\n");
}

echo "📄 Analizando: " . basename($file) . "\n";
echo "   Tamaño: " . number_format(filesize($filepath)) . " bytes\n\n";

// Cargar archivo
try {
    $spreadsheet = IOFactory::load($filepath);
    echo "✅ Archivo cargado correctamente\n\n";
} catch (Exception $e) {
    die("❌ ERROR al cargar archivo: " . $e->getMessage() . "\n");
}

// Función auxiliar
function getProtectionStatus($locked) {
    return $locked === \PhpOffice\PhpSpreadsheet\Style\Protection::PROTECTION_PROTECTED ? '🔒 Bloqueada' : '🔓 Desbloqueada';
}

// Analizar cada hoja
$totalSheets = $spreadsheet->getSheetCount();
echo "📋 Total de hojas: {$totalSheets}\n\n";

foreach ($spreadsheet->getAllSheets() as $index => $sheet) {
    $sheetName = $sheet->getTitle();
    $proteccion = $sheet->getProtection();
    
    echo str_repeat("=", 60) . "\n";
    echo "HOJA " . ($index + 1) . ": {$sheetName}\n";
    echo str_repeat("=", 60) . "\n\n";
    
    // Información de protección de la hoja
    $hojaProtegida = $proteccion->isProtectionEnabled();
    echo "Estado: " . ($hojaProtegida ? "🔒 PROTEGIDA" : "🔓 SIN PROTECCIÓN") . "\n";
    
    if ($hojaProtegida) {
        echo "Contraseña: " . ($proteccion->getPassword() ? "Sí (encriptada)" : "No") . "\n";
        echo "\nPermisos:\n";
        echo "  - Seleccionar celdas bloqueadas: " . ($proteccion->getSelectLockedCells() ? "Sí" : "No") . "\n";
        echo "  - Seleccionar celdas desbloqueadas: " . ($proteccion->getSelectUnlockedCells() ? "Sí" : "No") . "\n";
        echo "  - Formato de celdas: " . ($proteccion->getFormatCells() ? "Sí" : "No") . "\n";
        echo "  - Insertar filas: " . ($proteccion->getInsertRows() ? "Sí" : "No") . "\n";
        echo "  - Eliminar filas: " . ($proteccion->getDeleteRows() ? "Sí" : "No") . "\n";
    }
    
    echo "\n";
    
    // Analizar muestra de celdas
    $highestRow = min($sheet->getHighestDataRow(), 20); // Limitar a 20 filas
    $highestColumn = $sheet->getHighestDataColumn();
    $highestColIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
    $highestColIndex = min($highestColIndex, 10); // Limitar a 10 columnas
    
    echo "📊 Muestra de celdas (hasta fila 20, columna " . 
         \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($highestColIndex) . "):\n\n";
    
    echo "  Celda  │ Estado        │ Valor\n";
    echo "─────────┼───────────────┼────────────────────────────────\n";
    
    $celdasBloqueadas = 0;
    $celdasDesbloqueadas = 0;
    $celdasMuestreadas = 0;
    $maxMuestras = 30;
    
    for ($row = 1; $row <= $highestRow && $celdasMuestreadas < $maxMuestras; $row++) {
        for ($col = 1; $col <= $highestColIndex && $celdasMuestreadas < $maxMuestras; $col++) {
            $celda = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col) . $row;
            $cell = $sheet->getCell($celda);
            $valor = $cell->getValue();
            
            // Solo mostrar celdas con contenido
            if ($valor === null || $valor === '') {
                continue;
            }
            
            $style = $cell->getStyle();
            $locked = $style->getProtection()->getLocked();
            $estado = getProtectionStatus($locked);
            
            // Limitar longitud del valor
            $valorStr = (string)$valor;
            if (strlen($valorStr) > 30) {
                $valorStr = substr($valorStr, 0, 27) . '...';
            }
            
            printf("  %-7s│ %-13s │ %s\n", $celda, $estado, $valorStr);
            
            if ($locked === \PhpOffice\PhpSpreadsheet\Style\Protection::PROTECTION_PROTECTED) {
                $celdasBloqueadas++;
            } else {
                $celdasDesbloqueadas++;
            }
            
            $celdasMuestreadas++;
        }
    }
    
    echo "\n📈 Estadísticas de la muestra:\n";
    echo "   Total muestreadas: {$celdasMuestreadas}\n";
    echo "   🔒 Bloqueadas: {$celdasBloqueadas}\n";
    echo "   🔓 Desbloqueadas: {$celdasDesbloqueadas}\n";
    
    if ($hojaProtegida) {
        $porcentajeDesbloqueadas = $celdasMuestreadas > 0 
            ? round(($celdasDesbloqueadas / $celdasMuestreadas) * 100, 1)
            : 0;
        echo "   📊 Porcentaje desbloqueadas: {$porcentajeDesbloqueadas}%\n";
        
        echo "\n💡 Validación de contenido:\n";
        if ($celdasDesbloqueadas > 0) {
            echo "   ✅ Se validarán {$celdasDesbloqueadas} celdas desbloqueadas\n";
            echo "   ⏭️  Se ignorarán {$celdasBloqueadas} celdas bloqueadas\n";
        } else {
            echo "   ⚠️  No hay celdas desbloqueadas en la muestra\n";
            echo "   ℹ️  Todas las celdas están protegidas\n";
        }
    } else {
        echo "\n💡 Validación de contenido:\n";
        echo "   ✅ Se validarán TODAS las celdas (hoja sin protección)\n";
    }
    
    echo "\n";
}

// Resumen final
echo str_repeat("=", 60) . "\n";
echo "RESUMEN GENERAL\n";
echo str_repeat("=", 60) . "\n\n";

$hojasProtegidas = 0;
$hojasSinProteccion = 0;

foreach ($spreadsheet->getAllSheets() as $sheet) {
    if ($sheet->getProtection()->isProtectionEnabled()) {
        $hojasProtegidas++;
    } else {
        $hojasSinProteccion++;
    }
}

echo "📊 Hojas analizadas: {$totalSheets}\n";
echo "   🔒 Con protección: {$hojasProtegidas}\n";
echo "   🔓 Sin protección: {$hojasSinProteccion}\n\n";

if ($hojasProtegidas > 0) {
    echo "✅ El validador aplicará validación selectiva\n";
    echo "   → Solo revisará celdas desbloqueadas en hojas protegidas\n";
} else {
    echo "ℹ️  El validador revisará todas las celdas\n";
    echo "   → Ninguna hoja tiene protección activa\n";
}

echo "\n";

// Recomendaciones
if ($hojasProtegidas > 0 && $hojasSinProteccion > 0) {
    echo "⚠️  RECOMENDACIÓN:\n";
    echo "   Algunas hojas tienen protección y otras no.\n";
    echo "   Considera proteger todas las hojas para consistencia.\n\n";
}

echo "==========================================\n";
echo "TEST COMPLETADO\n";
echo "==========================================\n";

if (php_sapi_name() !== 'cli') {
    echo "</pre>";
    echo "<br><br>";
    echo "<a href='index.php' style='padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;'>Volver al Validador</a>";
}
