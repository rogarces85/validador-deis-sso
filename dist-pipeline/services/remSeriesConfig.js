// services/remSeriesConfig.ts
var RECOGNIZED_SERIES = ["A", "P", "D", "BM", "BS"];
var ENABLED_SERIES = ["A", "P"];
var SERIE_A_MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
var SERIE_P_MONTHS = ["06", "12"];
var SERIE_P_REQUIRED_SHEETS = [
  "NOMBRE",
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P9",
  "P11",
  "P12",
  "P13"
];
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
function getMissingRequiredSheetsForSerie(serie, sheets) {
  if (serie.toUpperCase() !== "P") return [];
  const sheetSet = new Set(sheets);
  return SERIE_P_REQUIRED_SHEETS.filter((sheet) => !sheetSet.has(sheet));
}
export {
  ENABLED_SERIES,
  RECOGNIZED_SERIES,
  SERIE_A_MONTHS,
  SERIE_P_MONTHS,
  SERIE_P_REQUIRED_SHEETS,
  getAllowedMonthsForSerie,
  getMissingRequiredSheetsForSerie,
  getMonthExpectationLabel,
  isEnabledSerie,
  isMonthAllowedForSerie
};
