// services/remSeriesConfig.ts
var RECOGNIZED_SERIES = ["A", "P", "D", "BM", "BS"];
var ENABLED_SERIES = ["A", "P"];
var SERIE_A_MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
var SERIE_P_MONTHS = ["06", "12"];
var MONTHS_BY_SERIE = {
  A: SERIE_A_MONTHS,
  P: SERIE_P_MONTHS
};
function isEnabledSerie(serie) {
  return ENABLED_SERIES.includes(serie.toUpperCase());
}
function getAllowedMonthsForSerie(serie) {
  const serieUpper = serie.toUpperCase();
  return isEnabledSerie(serieUpper) ? MONTHS_BY_SERIE[serieUpper] : [];
}
function getMonthExpectationLabel(serie) {
  const allowedMonths = getAllowedMonthsForSerie(serie);
  return allowedMonths.length ? allowedMonths.join(" o ") : "serie habilitada";
}
function isMonthAllowedForSerie(serie, month) {
  return getAllowedMonthsForSerie(serie).includes(month);
}

// services/filenameValidator.ts
var VALID_SERIES = RECOGNIZED_SERIES;
var _FilenameValidatorService = class _FilenameValidatorService {
  validate(filename) {
    const errors = [];
    if (!filename.toLowerCase().match(/\.(xlsx|xlsm)$/)) {
      return { isValid: false, errors: ["El archivo debe ser extensi\xF3n .xlsx o .xlsm"] };
    }
    const match = filename.match(_FilenameValidatorService.REGEX_FORMAT);
    let codigo, serie, mes;
    if (match) {
      [, codigo, serie, mes] = match;
    } else {
      return {
        isValid: false,
        errors: ["Formato de nombre inv\xE1lido. Esperado: [Codigo6][Serie1-2][Mes2].xlsx (Ej: 123100A02.xlsx, 123100BM01.xlsx)"]
      };
    }
    const serieUpper = serie.toUpperCase();
    if (!_FilenameValidatorService.SERIES_SET.has(serieUpper)) {
      errors.push(`Serie no reconocida: "${serieUpper}". Series v\xE1lidas: ${VALID_SERIES.join(", ")}`);
    } else if (!isEnabledSerie(serieUpper)) {
      errors.push(`La Serie "${serieUpper}" no est\xE1 realizada en el sistema. Actualmente solo est\xE1n disponibles las Series ${ENABLED_SERIES.join(" y ")}.`);
    }
    const mesNum = parseInt(mes, 10);
    if (mesNum < 1 || mesNum > 12) {
      errors.push(`Mes inv\xE1lido: ${mes}. Debe ser entre 01 y 12.`);
    } else if (isEnabledSerie(serieUpper) && !isMonthAllowedForSerie(serieUpper, mes)) {
      errors.push(`Mes inv\xE1lido para Serie ${serieUpper}: ${mes}. Debe ser ${getMonthExpectationLabel(serieUpper)}.`);
    }
    if (errors.length > 0) {
      return { isValid: false, errors };
    }
    const metadata = {
      nombreOriginal: filename,
      serieRem: serieUpper,
      mes,
      periodo: "2026",
      // Año defaulting to 2026 as per project context
      codigoEstablecimiento: codigo,
      extension: filename.split(".").pop()
    };
    return { isValid: true, errors: [], metadata };
  }
};
// Regex format: [IDESTABLECIMIENTO][SERIE][MES].(xlsx|xlsm)
// Ejemplo: 123100A02.xlsx, 123100BM01.xlsx
// Grupos: 1: Codigo (6 digitos), 2: Serie (1-2 letras: A, P, D, BM, BS), 3: Mes (2 digitos)
_FilenameValidatorService.REGEX_FORMAT = /^(\d{6})([A-Z]{1,2})(\d{2})\.(xlsx|xlsm)$/i;
// js-set-map-lookups: O(1) lookup for valid series
_FilenameValidatorService.SERIES_SET = new Set(VALID_SERIES.map((s) => s.toUpperCase()));
var FilenameValidatorService = _FilenameValidatorService;
export {
  FilenameValidatorService,
  VALID_SERIES
};
