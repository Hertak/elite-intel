(function () {
const { buildActionsJava } = window.TranslationParsers;

function exportActions(originalSourceText, data, className = "SpanishAiActionAliases") {
  return buildActionsJava(originalSourceText, data, className);
}

window.TranslationExporters = window.TranslationExporters || {};
window.TranslationExporters.exportActions = exportActions;
})();
