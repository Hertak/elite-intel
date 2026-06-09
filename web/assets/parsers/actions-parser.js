const SET_OF_REGEX = /return\s+Set\.of\((.*)\);/;
const MAP_PUT_REGEX = /map\.put\("((?:\\.|[^"\\])*)",\s*([A-Z0-9_]+)\.getAction\(\)\);/;

function parseActionsJava(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const classNameMatch = normalized.match(/public class\s+(\w+)\s+implements/);
  const className = classNameMatch?.[1] ?? "UnknownAiActionAliases";
  const entries = [];
  let wakePhrases = [];
  let listenPrefixes = [];
  let setOfCounter = 0;
  let mapCounter = 0;

  lines.forEach((line, index) => {
    const setMatch = line.match(SET_OF_REGEX);
    if (setMatch) {
      const values = splitJavaStringList(setMatch[1]);
      if (setOfCounter === 0) wakePhrases = values;
      if (setOfCounter === 1) listenPrefixes = values;
      setOfCounter += 1;
      return;
    }

    const mapMatch = line.match(MAP_PUT_REGEX);
    if (!mapMatch) return;
    mapCounter += 1;
    entries.push({
      id: `${mapMatch[2]}__${mapCounter}`,
      action: mapMatch[2],
      phrases: unescapeJava(mapMatch[1]),
      line: index + 1,
      order: mapCounter,
    });
  });

  return {
    className,
    raw: normalized,
    wakePhrases,
    listenPrefixes,
    entries,
  };
}

function buildActionsJava(originalText, data, fallbackClassName = "SpanishAiActionAliases") {
  const lines = originalText.replace(/\r\n/g, "\n").split("\n");
  const wakeJoined = joinJavaStringList(data.wakePhrases);
  const listenJoined = joinJavaStringList(data.listenPrefixes);
  const entriesByOrder = new Map(data.entries.map((entry) => [entry.order, entry]));
  let setOfCounter = 0;
  let mapCounter = 0;

  return lines.map((line) => {
    if (/public class\s+\w+\s+implements/.test(line)) {
      return line.replace(/public class\s+\w+\s+implements/, `public class ${fallbackClassName} implements`);
    }

    if (SET_OF_REGEX.test(line)) {
      const joined = setOfCounter === 0 ? wakeJoined : listenJoined;
      setOfCounter += 1;
      return line.replace(SET_OF_REGEX, `return Set.of(${joined});`);
    }

    if (MAP_PUT_REGEX.test(line)) {
      mapCounter += 1;
      const current = entriesByOrder.get(mapCounter);
      if (!current) return line;
      const escaped = escapeJava(current.phrases);
      return line.replace(MAP_PUT_REGEX, `map.put("${escaped}", ${current.action}.getAction());`);
    }

    return line;
  }).join("\n");
}

function splitJavaStringList(content) {
  const result = [];
  const regex = /"((?:\\.|[^"\\])*)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    result.push(unescapeJava(match[1]));
  }
  return result;
}

function joinJavaStringList(values) {
  return values.map((value) => `"${escapeJava(value)}"`).join(", ");
}

function unescapeJava(value) {
  return value
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function escapeJava(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t");
}

window.TranslationParsers = window.TranslationParsers || {};
window.TranslationParsers.parseActionsJava = parseActionsJava;
window.TranslationParsers.buildActionsJava = buildActionsJava;
