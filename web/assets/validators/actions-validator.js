(function () {
const { normalizeText, samePlaceholders } = window.TranslationApp;

function compareActions(original, translated) {
  const rows = [];
  const translatedByOrder = new Map((translated?.entries ?? []).map((entry) => [entry.order, entry]));

  original.entries.forEach((sourceEntry) => {
    const translatedEntry = translatedByOrder.get(sourceEntry.order);
    const spanish = translatedEntry?.phrases ?? "";
    const english = sourceEntry.phrases;
    const issues = [];
    let level = "ok";

    if (!translatedEntry) {
      issues.push("Missing action entry in translated file");
      level = "error";
    } else if (!samePlaceholders(english, spanish)) {
      issues.push("Placeholder mismatch");
      level = "error";
    } else if (!normalizeText(spanish)) {
      issues.push("Empty aliases");
      level = "warning";
    } else if (normalizeText(english) === normalizeText(spanish)) {
      issues.push("Same as source");
      level = "warning";
    }

    rows.push({
      id: sourceEntry.id,
      order: sourceEntry.order,
      action: sourceEntry.action,
      english,
      spanish,
      status: issues[0] ?? "OK",
      level,
      issues,
      note: "",
      doubt: false,
      changed: normalizeText(spanish) !== normalizeText(english),
      missing: !translatedEntry,
    });
  });

  return rows;
}

window.TranslationValidators = window.TranslationValidators || {};
window.TranslationValidators.compareActions = compareActions;
})();
