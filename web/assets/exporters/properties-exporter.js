(function () {
function exportProperties(rows) {
  return rows
    .filter((row) => row.key)
    .map((row) => `${row.key}=${row.spanish ?? ""}`)
    .join("\n");
}

window.TranslationExporters = window.TranslationExporters || {};
window.TranslationExporters.exportProperties = exportProperties;
})();
