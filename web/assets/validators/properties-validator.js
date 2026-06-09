(function () {
const { normalizeText, samePlaceholders } = window.TranslationApp;

function compareProperties(original, translated) {
  const rows = [];
  const translatedKeys = new Set(translated?.entries.map((entry) => entry.key) ?? []);

  for (const sourceEntry of original.entries) {
    const translatedEntry = translated.byKey.get(sourceEntry.key);
    const spanish = translatedEntry?.value ?? "";
    const english = sourceEntry.value ?? "";
    const issues = [];
    let level = "ok";

    if (!translatedEntry) {
      issues.push("Missing key in translated file");
      level = "error";
    } else if (!samePlaceholders(english, spanish)) {
      issues.push("Placeholder mismatch");
      level = "error";
    } else if (!normalizeText(spanish)) {
      issues.push("Empty translation");
      level = "warning";
    } else if (normalizeText(english) === normalizeText(spanish)) {
      issues.push("Same as source");
      level = "warning";
    }

    rows.push({
      key: sourceEntry.key,
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
    translatedKeys.delete(sourceEntry.key);
  }

  for (const extraKey of translatedKeys) {
    const entry = translated.byKey.get(extraKey);
    rows.push({
      key: extraKey,
      english: "",
      spanish: entry?.value ?? "",
      german: "",
      status: "Extra key in translated file",
      level: "error",
      issues: ["Extra key in translated file"],
      note: "",
      doubt: false,
      changed: true,
      missing: false,
      extra: true,
    });
  }

  return rows;
}

window.TranslationValidators = window.TranslationValidators || {};
window.TranslationValidators.compareProperties = compareProperties;
})();
