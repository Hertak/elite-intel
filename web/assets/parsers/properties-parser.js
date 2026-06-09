function parseProperties(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const entries = [];
  const byKey = new Map();

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || (!line.includes("=") && !line.includes(":"))) return;
    const separatorIndex = findSeparator(line);
    if (separatorIndex === -1) return;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    const entry = { key, value, line: index + 1 };
    entries.push(entry);
    byKey.set(key, entry);
  });

  return { entries, byKey };
}

function findSeparator(line) {
  const eq = line.indexOf("=");
  const col = line.indexOf(":");
  if (eq === -1) return col;
  if (col === -1) return eq;
  return Math.min(eq, col);
}

window.TranslationParsers = window.TranslationParsers || {};
window.TranslationParsers.parseProperties = parseProperties;
