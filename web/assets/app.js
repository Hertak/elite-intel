function readFileText(file) {
  if (!file) return "";
  return file.text();
}

function setCardState(element, state) {
  if (!element) return;
  element.classList.remove("ok", "error");
  if (state) element.classList.add(state);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value = "") {
  return value.replace(/\r\n/g, "\n").trim();
}

function placeholdersOf(value = "") {
  return [...value.matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort();
}

function samePlaceholders(a = "", b = "") {
  return JSON.stringify(placeholdersOf(a)) === JSON.stringify(placeholdersOf(b));
}

function makeStatusLabel(level, text) {
  const cls = level === "error" ? "status-error" : level === "warning" ? "status-warning" : "status-ok";
  return `<span class="status-badge ${cls}">${escapeHtml(text)}</span>`;
}

function summaryMarkup(items) {
  return items.map((item) => `
    <article class="summary-pill">
      <strong>${escapeHtml(String(item.value))}</strong>
      <span>${escapeHtml(item.label)}</span>
    </article>
  `).join("");
}

function collectDoubts(rows, mapper) {
  const lines = [
    "# Translation Doubts Export",
    "",
    "Generated from the web helper.",
    ""
  ];

  rows.filter((row) => row.doubt || row.note).forEach((row, index) => {
    lines.push(...mapper(row, index + 1), "");
  });

  return lines.join("\n");
}

window.TranslationApp = {
  readFileText,
  setCardState,
  downloadText,
  escapeHtml,
  normalizeText,
  placeholdersOf,
  samePlaceholders,
  makeStatusLabel,
  summaryMarkup,
  collectDoubts,
};
