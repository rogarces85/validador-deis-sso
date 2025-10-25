<?php
/**
 * Script de validación de archivos Excel REM DEIS SSO
 * Versión Final con validación de contenido de celdas
 */

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Style\Border;

// Configuración UTF-8
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_regex_encoding('UTF-8');
header('Content-Type: text/html; charset=UTF-8');

// Configuración
ini_set('memory_limit', '512M');
set_time_limit(300);

// ==================== FUNCIONES ====================

/**
 * Valida el contenido de una celda
 */
function validarContenidoCelda($valorCelda, $tipoDato = 'numerico') {
    $resultado = [
        'valido' => true,
        'error' => '',
        'valor_original' => $valorCelda,
        'valor_limpio' => null,
        'advertencias' => []
    ];
    
    if ($valorCelda === null || $valorCelda === '') {
        $resultado['valor_limpio'] = 0;
        return $resultado;
    }
    
    $valorStr = (string)$valorCelda;
    $valorOriginal = $valorStr;
    
    // Detectar espacios
    if (preg_match('/\s/', $valorStr)) {
        $resultado['advertencias'][] = "Contiene espacios";
        $valorStr = preg_replace('/\s+/', '', $valorStr);
    }
    
    // Detectar letras
    if (preg_match('/[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ]/', $valorStr)) {
        $resultado['valido'] = false;
        $resultado['error'] = "Contiene letras";
        return $resultado;
    }
    
    // Detectar caracteres especiales
    if (preg_match('/[^0-9.,\-]/', $valorStr)) {
        preg_match_all('/[^0-9.,\-]/', $valorStr, $matches);
        $caracteres = array_unique($matches[0]);
        $resultado['valido'] = false;
        $resultado['error'] = "Caracteres no permitidos: " . implode(', ', $caracteres);
        return $resultado;
    }
    
    // Normalizar formato
    $valorStr = str_replace(',', '.', $valorStr);
    
    // Validar formato numérico
    if (substr_count($valorStr, '.') > 1) {
        $resultado['valido'] = false;
        $resultado['error'] = "Múltiples puntos decimales";
        return $resultado;
    }
    
    if (substr_count($valorStr, '-') > 1 || (strpos($valorStr, '-') !== false && strpos($valorStr, '-') !== 0)) {
        $resultado['valido'] = false;
        $resultado['error'] = "Signo negativo inválido";
        return $resultado;
    }
    
    if (!is_numeric($valorStr)) {
        $resultado['valido'] = false;
        $resultado['error'] = "No es un número válido";
        return $resultado;
    }
    
    $resultado['valor_limpio'] = floatval($valorStr);
    return $resultado;
}

/**
 * Verifica si una celda está desbloqueada (editable)
 */
function esCeldaEditable($sheet, $celda) {
    try {
        $cell = $sheet->getCell($celda);
        $style = $cell->getStyle();
        
        // Verificar si la hoja tiene protección activa
        $hojaProtegida = $sheet->getProtection()->isProtectionEnabled();
        
        if (!$hojaProtegida) {
            return true; // Sin protección, todas editables
        }
        
        // Verificar el estado de bloqueo de la celda
        $celdaBloqueada = $style->getProtection()->getLocked();
        
        // Retornar true si NO está bloqueada
        return ($celdaBloqueada === \PhpOffice\PhpSpreadsheet\Style\Protection::PROTECTION_UNPROTECTED);
        
    } catch (Exception $e) {
        return true; // En caso de error, validar por seguridad
    }
}

/**
 * Calcula valor de celda/expresión con validación SOLO de celdas editables
 */
function cellValue($spreadsheet, $currentSheet, $expresion, &$erroresContenido = [], $validarSoloEditables = true) {
    $expr = trim($expresion);
    
    // Función SUM
    if (preg_match('/^SUM\((.+)\)$/i', $expr, $m)) {
        $argumentos = preg_split('/\s*,\s*/', $m[1]);
        $suma = 0;
        foreach ($argumentos as $arg) {
            $suma += cellValue($spreadsheet, $currentSheet, $arg, $erroresContenido, $validarSoloEditables);
        }
        return $suma;
    }
    
    // Suma con +
    if (strpos($expr, '+') !== false) {
        $partes = preg_split('/\s*\+\s*/', $expr);
        $total = 0;
        foreach ($partes as $parte) {
            $total += cellValue($spreadsheet, $currentSheet, $parte, $erroresContenido, $validarSoloEditables);
        }
        return $total;
    }
    
    // Rango
    if (preg_match('/^(?:(?P<sheet>[A-Z0-9_]+)!\()?([A-Z]+\d+):([A-Z]+\d+)\)?$/i', $expr, $m)) {
        $sheetName = !empty($m['sheet']) ? $m['sheet'] : $currentSheet->getTitle();
        $sheet = $spreadsheet->getSheetByName($sheetName);
        
        if (!$sheet) return 0;
        
        try {
            $rango = $sheet->rangeToArray($m[2] . ':' . $m[3], null, true, true, true);
            $suma = 0;
            
            foreach ($rango as $fila => $columnas) {
                foreach ($columnas as $col => $valor) {
                    $celdaCoord = $col . $fila;
                    
                    // VALIDAR SOLO SI LA CELDA ES EDITABLE
                    $esEditable = !$validarSoloEditables || esCeldaEditable($sheet, $celdaCoord);
                    
                    $validacion = validarContenidoCelda($valor);
                    
                    if ($esEditable && !$validacion['valido'] && ($valor !== null && $valor !== '')) {
                        $erroresContenido[] = [
                            'celda' => $celdaCoord,
                            'hoja' => $sheetName,
                            'tipo' => 'CONTENIDO_INVALIDO',
                            'error' => $validacion['error'],
                            'valor' => $validacion['valor_original']
                        ];
                    }
                    $suma += $validacion['valor_limpio'];
                }
            }
            return $suma;
        } catch (Exception $e) {
            error_log("Error al leer rango: " . $e->getMessage());
            return 0;
        }
    }
    
    // Otra hoja
    if (preg_match('/^([A-Z0-9_]+)!([A-Z]+\d+)$/i', $expr, $m)) {
        $sheet = $spreadsheet->getSheetByName($m[1]);
        if (!$sheet) return 0;
        
        try {
            $valor = $sheet->getCell($m[2])->getCalculatedValue();
            
            // VALIDAR SOLO SI ES EDITABLE
            $esEditable = !$validarSoloEditables || esCeldaEditable($sheet, $m[2]);
            
            $validacion = validarContenidoCelda($valor);
            
            if ($esEditable && !$validacion['valido'] && ($valor !== null && $valor !== '')) {
                $erroresContenido[] = [
                    'celda' => $m[1] . '!' . $m[2],
                    'hoja' => $m[1],
                    'tipo' => 'CONTENIDO_INVALIDO',
                    'error' => $validacion['error'],
                    'valor' => $validacion['valor_original']
                ];
            }
            return $validacion['valor_limpio'];
        } catch (Exception $e) {
            return 0;
        }
    }
    
    // Celda simple
    if (preg_match('/^[A-Z]+\d+$/i', $expr)) {
        try {
            $valor = $currentSheet->getCell($expr)->getCalculatedValue();
            
            // VALIDAR SOLO SI ES EDITABLE
            $esEditable = !$validarSoloEditables || esCeldaEditable($currentSheet, $expr);
            
            $validacion = validarContenidoCelda($valor);
            
            if ($esEditable && !$validacion['valido'] && ($valor !== null && $valor !== '')) {
                $erroresContenido[] = [
                    'celda' => $expr,
                    'hoja' => $currentSheet->getTitle(),
                    'tipo' => 'CONTENIDO_INVALIDO',
                    'error' => $validacion['error'],
                    'valor' => $validacion['valor_original']
                ];
            }
            return $validacion['valor_limpio'];
        } catch (Exception $e) {
            return 0;
        }
    }
    
    if (is_numeric($expr)) {
        return floatval($expr);
    }
    
    return 0;
}

/**
 * Carga establecimientos con UTF-8 correcto
 */
function cargarEstablecimientos($rutaTxt) {
    $map = [];
    if (!file_exists($rutaTxt)) return $map;
    
    $contenido = file_get_contents($rutaTxt);
    $encoding = mb_detect_encoding($contenido, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
    
    if ($encoding && $encoding !== 'UTF-8') {
        $contenido = mb_convert_encoding($contenido, 'UTF-8', $encoding);
    }
    
    $patron = '/"(?P<cod>\d{6})"\s*=>\s*\[\s*"nombre"\s*=>\s*"(?P<nom>[^"]+)"/u';
    
    if (preg_match_all($patron, $contenido, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $nombre = trim($match['nom']);
            if (!mb_check_encoding($nombre, 'UTF-8')) {
                $nombre = mb_convert_encoding($nombre, 'UTF-8', 'auto');
            }
            $map[$match['cod']] = $nombre;
        }
    }
    
    return $map;
}

function parseFileName($file) {
    if (!preg_match('/^(\d{6})([A-Z]+)(\d{2})/i', $file, $matches)) {
        return [null, null, null];
    }
    return [$matches[1], strtoupper($matches[2]), $matches[3]];
}

function comparar($valor1, $valor2, $operador) {
    $epsilon = 0.0001;
    switch($operador) {
        case '==': return abs($valor1 - $valor2) < $epsilon;
        case '!=': return abs($valor1 - $valor2) >= $epsilon;
        case '<': return $valor1 < $valor2;
        case '>': return $valor1 > $valor2;
        case '<=': return $valor1 <= $valor2 || abs($valor1 - $valor2) < $epsilon;
        case '>=': return $valor1 >= $valor2 || abs($valor1 - $valor2) < $epsilon;
        default: return false;
    }
}

function generarExcel($nombreEst, $codigo, $file, $mes, $aplicadas, $resultados, $erroresContenido) {
    $wb = new Spreadsheet();
    $ws = $wb->getActiveSheet();
    $ws->setTitle('Resultado Validación');
    
    // Encabezado
    $ws->mergeCells('A1:F1');
    $ws->setCellValueExplicit('A1', "Establecimiento: " . ($nombreEst ?: $codigo), DataType::TYPE_STRING);
    $ws->getStyle('A1')->getFont()->setBold(true)->setSize(14);
    
    $ws->mergeCells('A2:F2');
    $ws->setCellValue('A2', "Archivo: $file | Código: $codigo | Mes: $mes | Reglas: $aplicadas");
    $ws->getStyle('A2')->getFont()->setSize(11);
    
    // Cabeceras
    $headers = ['ID', 'Hoja', 'Expresión', 'Severidad', 'Mensaje', 'Valores'];
    $ws->fromArray($headers, null, 'A4');
    $ws->getStyle('A4:F4')->getFont()->setBold(true);
    $ws->getStyle('A4:F4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $ws->getStyle('A4:F4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF1F3F5');
    
    // Primero: Errores de contenido
    $fila = 5;
    if (!empty($erroresContenido)) {
        foreach ($erroresContenido as $error) {
            $ws->fromArray([
                'CONTENIDO',
                $error['hoja'],
                $error['celda'],
                'ERROR',
                $error['error'],
                "Valor encontrado: '{$error['valor']}'"
            ], null, 'A' . $fila);
            
            $ws->getStyle('A' . $fila . ':F' . $fila)->getFill()
                ->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFD7D7');
            $fila++;
        }
    }
    
    // Luego: Errores de validación
    foreach ($resultados as $r) {
        $ws->fromArray([
            $r['id'],
            $r['hoja'],
            $r['expresion'],
            $r['severidad'],
            $r['mensaje'],
            $r['valores']
        ], null, 'A' . $fila);
        
        $colores = [
            'ERROR' => 'FFF8D7DA',
            'REVISAR' => 'FFFFF3CD',
            'OBSERVAR' => 'FFE3F7FF',
            'INDICADOR' => 'FFE8F0FF'
        ];
        
        if (isset($colores[$r['severidad']])) {
            $ws->getStyle('A' . $fila . ':F' . $fila)->getFill()
                ->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($colores[$r['severidad']]);
        }
        $fila++;
    }
    
    // Anchos
    $ws->getColumnDimension('A')->setWidth(12);
    $ws->getColumnDimension('B')->setWidth(12);
    $ws->getColumnDimension('C')->setWidth(45);
    $ws->getColumnDimension('D')->setWidth(16);
    $ws->getColumnDimension('E')->setWidth(60);
    $ws->getColumnDimension('F')->setWidth(55);
    
    // Bordes
    $ws->getStyle('A4:F' . ($fila - 1))->getBorders()->getAllBorders()
        ->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFDDDDDD');
    
    $ws->freezePane('A5');
    
    return $wb;
}

// ==================== EJECUCIÓN PRINCIPAL ====================

$file = $_GET['file'] ?? null;
$export = isset($_GET['export']);

if (!$file) {
    http_response_code(400);
    die("No se especificó el archivo.");
}

$path = __DIR__ . "/Datos/" . basename($file);

if (!file_exists($path)) {
    http_response_code(404);
    die("Archivo no encontrado: " . htmlspecialchars($file));
}

// Cargar datos
$rules = json_decode(file_get_contents(__DIR__ . "/rules.json"), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error al cargar reglas: " . json_last_error_msg());
}

$establecimientos = cargarEstablecimientos(__DIR__ . "/establecimientos.txt");
list($codigo, $serie, $mes) = parseFileName($file);
$nombreEst = $establecimientos[$codigo] ?? null;

// Validar establecimiento
if (!$nombreEst) {
    include 'error_establecimiento.php';
    exit;
}

// Cargar Excel
try {
    $spreadsheet = IOFactory::load($path);
} catch (Exception $e) {
    http_response_code(500);
    die("Error al cargar el archivo Excel: " . $e->getMessage());
}

// Aplicar validaciones
$resultados = [];
$erroresContenido = [];
$aplicadas = 0;
$hojasProtegidas = [];

// Analizar protección de hojas
foreach ($spreadsheet->getAllSheets() as $sheet) {
    $proteccion = $sheet->getProtection();
    if ($proteccion->isProtectionEnabled()) {
        $hojasProtegidas[] = $sheet->getTitle();
    }
}

foreach ($rules['validaciones'] as $sheetName => $validaciones) {
    $sheet = $spreadsheet->getSheetByName($sheetName);
    if (!$sheet) continue;
    
    foreach ($validaciones as $validacion) {
        // Filtrar por establecimiento
        if (isset($validacion['aplicar_a']) && 
            is_array($validacion['aplicar_a']) && 
            !in_array($codigo, $validacion['aplicar_a'])) {
            continue;
        }
        
        $aplicadas++;
        
        try {
            $expr1 = $validacion['expresion_1'];
            $expr2 = $validacion['expresion_2'];
            
            // Validar con detección de errores de contenido
            $valor1 = cellValue($spreadsheet, $sheet, $expr1, $erroresContenido);
            $valor2 = cellValue($spreadsheet, $sheet, $expr2, $erroresContenido);
            
            $cumple = comparar($valor1, $valor2, $validacion['operador']);
            
            if (!$cumple) {
                $resultados[] = [
                    'id' => $validacion['id'],
                    'hoja' => $sheetName,
                    'expresion' => "{$expr1} {$validacion['operador']} {$expr2}",
                    'severidad' => strtoupper($validacion['severidad']),
                    'mensaje' => $validacion['mensaje'],
                    'valores' => sprintf(
                       "Valor 1 (%s):%.0f, Valor 2 (%s): %.0f",
                        $expr1, $valor1, $expr2, $valor2
                    )
                ];
            }
        } catch (Exception $e) {
            error_log("Error en validación {$validacion['id']}: " . $e->getMessage());
        }
    }
}

// Eliminar duplicados de errores de contenido
$erroresContenido = array_values(array_unique($erroresContenido, SORT_REGULAR));

// Exportar a Excel
if ($export) {
    $wb = generarExcel($nombreEst, $codigo, $file, $mes, $aplicadas, $resultados, $erroresContenido);
    $filename = "Vali{$codigo}{$mes}.xlsx";
    
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    
    $writer = new Xlsx($wb);
    $writer->save('php://output');
    exit;
}

// Renderizar HTML
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Resultado Validaciones - DEIS SSO</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
<style>
  :root {
    --azul-principal: #007BFF;
    --azul-oscuro: #004B70;
    --fondo: #F8FAFC;
  }
  body { background: var(--fondo); }
  .brand { display: flex; align-items: center; gap: 1rem; }
  .brand img { height: 72px; width: auto; }
  .brand h5 { color: var(--azul-oscuro); margin: 0; font-weight: 800; }
  .badge-ERROR { background: #dc3545; }
  .badge-REVISAR { background: #ffc107; color: #000; }
  .badge-OBSERVAR { background: #0dcaf0; color: #000; }
  .badge-CONTENIDO_INVALIDO { background: #dc143c; color: #fff; }
  .row-error { background: #f8d7da; }
  .row-contenido { background: #ffd7d7; }
  .row-revisar { background: #fff3cd; }
  .row-observar { background: #e3f7ff; }
  .stat-card { border-left: 4px solid; padding: 1rem; margin-bottom: 1rem; }
  .stat-card.error { border-color: #dc3545; background: #fff5f5; }
  .stat-card.success { border-color: #28a745; background: #f0fff4; }
  .alert-info.est { font-size: 1.15rem; }
  .alert-info.est strong { font-size: 1.3rem; }
</style>
</head>
<body class="p-3 p-md-4">

<div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
  <div class="brand">
    <img src="assets/logo.png" alt="DEIS Osorno Logo">
    <h5>Validador DEIS SSO 2025</h5>
  </div>
  <span class="badge bg-success">Validación completada</span>
</div>

<div class="alert alert-info est">
  <strong><?= htmlspecialchars($nombreEst ?: $codigo) ?></strong>
  <div class="small text-muted">
    Archivo: <?= htmlspecialchars($file) ?> — 
    Código: <?= htmlspecialchars($codigo) ?> — 
    Mes: <?= htmlspecialchars($mes) ?> —
    Serie: <?= htmlspecialchars($serie) ?>
  </div>
  <?php if (!empty($hojasProtegidas)): ?>
  <div class="small mt-2">
    <span class="badge bg-secondary">🔒 Hojas protegidas: <?= count($hojasProtegidas) ?></span>
    <span class="text-muted small ms-2">Solo se validan celdas desbloqueadas</span>
  </div>
  <?php endif; ?>
</div>

<!-- Resumen -->
<div class="row mb-4">
  <div class="col-md-3">
    <div class="stat-card <?= empty($resultados) && empty($erroresContenido) ? 'success' : 'error' ?>">
      <div class="text-muted small">Reglas Aplicadas</div>
      <div class="h3 mb-0"><?= $aplicadas ?></div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="stat-card error">
      <div class="text-muted small">Errores de Contenido</div>
      <div class="h3 mb-0 text-danger"><?= count($erroresContenido) ?></div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="stat-card <?= empty($resultados) ? 'success' : 'error' ?>">
      <div class="text-muted small">Errores de Validación</div>
      <div class="h3 mb-0 <?= empty($resultados) ? 'text-success' : 'text-danger' ?>"><?= count($resultados) ?></div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="stat-card <?= empty($resultados) && empty($erroresContenido) ? 'success' : 'error' ?>">
      <div class="text-muted small">Total Incidencias</div>
      <div class="h3 mb-0"><?= count($erroresContenido) + count($resultados) ?></div>
    </div>
  </div>
</div>

<?php if (!empty($erroresContenido)): ?>
<div class="alert alert-danger">
  <h5 class="alert-heading">⚠️ Errores de Contenido Detectados</h5>
  <p class="mb-0">Se encontraron <strong><?= count($erroresContenido) ?></strong> celdas con contenido inválido (letras, espacios, caracteres especiales, etc.)</p>
  <p class="small text-muted mb-0 mt-1">
    ℹ️ Solo se validan celdas <strong>desbloqueadas/editables</strong>. Las celdas bloqueadas (fórmulas, títulos) no se revisan.
  </p>
</div>($erroresContenido) ?></strong> celdas con contenido inválido (letras, espacios, caracteres especiales, etc.)</p>
</div>

<h6 class="mt-4 mb-3">🔴 Errores de Contenido de Celdas:</h6>
<div class="table-responsive mb-4">
<table class="table table-bordered table-hover align-middle">
  <thead class="table-danger">
    <tr>
      <th>Hoja</th>
      <th>Celda</th>
      <th>Error</th>
      <th>Valor Encontrado</th>
    </tr>
  </thead>
  <tbody>
  <?php foreach ($erroresContenido as $error): ?>
    <tr class="row-contenido">
      <td><?= htmlspecialchars($error['hoja']) ?></td>
      <td><code><?= htmlspecialchars($error['celda']) ?></code></td>
      <td><?= htmlspecialchars($error['error']) ?></td>
      <td><strong><?= htmlspecialchars($error['valor']) ?></strong></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>
<?php endif; ?>

<h6 class="mt-4 mb-3">Errores de Validación de Reglas:</h6>

<?php if (!empty($resultados)): ?>
<div class="table-responsive">
<table class="table table-bordered table-hover align-middle">
  <thead class="table-light">
    <tr>
      <th style="width:90px;">ID</th>
      <th style="width:80px;">Hoja</th>
      <th>Expresión</th>
      <th style="width:130px;">Severidad</th>
      <th>Mensaje</th>
      <th style="min-width:240px;">Valores</th>
    </tr>
  </thead>
  <tbody>
  <?php foreach ($resultados as $r): 
    $rowClass = match($r['severidad']) {
      'ERROR' => 'row-error',
      'REVISAR' => 'row-revisar',
      'OBSERVAR' => 'row-observar',
      default => ''
    };
  ?>
    <tr class="<?= $rowClass ?>">
      <td><?= htmlspecialchars($r['id']) ?></td>
      <td><?= htmlspecialchars($r['hoja']) ?></td>
      <td><code class="small"><?= htmlspecialchars($r['expresion']) ?></code></td>
      <td>
        <span class="badge badge-<?= $r['severidad'] ?>">
          <?= htmlspecialchars($r['severidad']) ?>
        </span>
      </td>
      <td><?= htmlspecialchars($r['mensaje']) ?></td>
      <td class="small"><?= htmlspecialchars($r['valores']) ?></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>
<?php else: ?>
<div class="alert alert-success">
  <h5 class="alert-heading">✅ Sin errores de validación</h5>
  <p class="mb-0">Todas las reglas de validación se cumplieron correctamente.</p>
</div>
<?php endif; ?>

<?php if (empty($resultados) && empty($erroresContenido)): ?>
<div class="alert alert-success mt-3">
  <h4 class="alert-heading">🎉 ¡Archivo Completamente Válido!</h4>
  <p class="mb-0">El archivo no presenta ningún error de contenido ni de validación.</p>
</div>
<?php endif; ?>

<div class="d-flex gap-2 mt-4">
  <a href="validar_excel.php?file=<?= urlencode($file) ?>&export=1" class="btn btn-success">
    📊 Exportar a Excel
  </a>
  <a href="index.php" class="btn btn-outline-secondary">
    ← Volver
  </a>
</div>

</body>
</html>