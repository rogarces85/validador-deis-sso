import { ExcelReaderService } from '../../services/excelService';

/**
 * Ejemplo de cómo procesar todas las hojas de manera eficiente
 * integrándose con el servicio existente.
 */
export const processAllSheetsEfficiently = async (file: File) => {
    const excelService = ExcelReaderService.getInstance();

    // 1. Carga el archivo (implementa internamente XLSX.read optimizado)
    await excelService.loadFile(file);

    // 2. Obtiene los nombres de todas las hojas
    const sheetNames = excelService.getSheets();

    // 3. Itera y procesa
    const reportSummary = sheetNames.map(name => {
        // En los REM, a veces las hojas están vacías o son de ayuda
        // Podemos filtrar por nombres de serie conocidos
        const isSerieSheet = /^(A|BS|BM|D|P|AX|ANEXO)/i.test(name);

        if (!isSerieSheet) return null;

        // Sumar un rango típico de totales (ejemplo)
        const totalValue = excelService.getRangeSum(name, 'C1:C100');

        return {
            sheet: name,
            total: totalValue
        };
    }).filter(Boolean);

    return reportSummary;
};
