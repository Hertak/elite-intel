(function () {
const { collectDoubts, downloadText, escapeHtml, makeStatusLabel, readFileText, setCardState, summaryMarkup } = window.TranslationApp;
const { exportProperties } = window.TranslationExporters;
const { parseProperties } = window.TranslationParsers;
const { compareProperties } = window.TranslationValidators;

const state = {
  original: null,
  translated: null,
  rows: [],
  filter: "all",
  search: "",
};

const els = {
  originalInput: document.getElementById("guiOriginalInput"),
  translatedInput: document.getElementById("guiTranslatedInput"),
  originalCard: document.getElementById("guiOriginalCard"),
  translatedCard: document.getElementById("guiTranslatedCard"),
  originalName: document.getElementById("guiOriginalName"),
  translatedName: document.getElementById("guiTranslatedName"),
  summary: document.getElementById("guiSummary"),
  tableBody: document.getElementById("guiTableBody"),
  filters: document.getElementById("guiFilters"),
  search: document.getElementById("guiSearchInput"),
  validateButton: document.getElementById("validateGuiButton"),
  exportButton: document.getElementById("exportGuiButton"),
  exportDoubtsButton: document.getElementById("exportGuiDoubtsButton"),
};

wire();
render();

function wire() {
  els.originalInput.addEventListener("change", async (event) => loadFile("original", event.target.files[0]));
  els.translatedInput.addEventListener("change", async (event) => loadFile("translated", event.target.files[0]));
  els.filters.addEventListener("click", (event) => {
    const filter = event.target.dataset.filter;
    if (!filter) return;
    state.filter = filter;
    [...els.filters.querySelectorAll("button")].forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
    renderTable();
  });
  els.search.addEventListener("input", (event) => {
    state.search = event.target.value.toLowerCase();
    renderTable();
  });
  els.validateButton.addEventListener("click", validateAndRender);
  els.exportButton.addEventListener("click", exportCurrent);
  els.exportDoubtsButton.addEventListener("click", exportDoubts);
  els.tableBody.addEventListener("input", handleTableInput);
  els.tableBody.addEventListener("change", handleTableInput);
}

async function loadFile(kind, file) {
  const text = await readFileText(file);
  if (!text) return;
  state[kind] = parseProperties(text);
  els[`${kind}Name`].textContent = file.name;
  setCardState(els[`${kind}Card`], "ok");
  validateAndRender();
}

function validateAndRender() {
  if (!state.original || !state.translated) {
    render();
    return;
  }
  state.rows = compareProperties(state.original, state.translated);
  render();
}

function render() {
  renderSummary();
  renderTable();
}

function renderSummary() {
  if (!state.rows.length) {
    els.summary.innerHTML = summaryMarkup([
      { label: "Total keys", value: 0 },
      { label: "Missing", value: 0 },
      { label: "Errors", value: 0 },
      { label: "Warnings", value: 0 },
      { label: "Doubts", value: 0 },
    ]);
    return;
  }

  els.summary.innerHTML = summaryMarkup([
    { label: "Total keys", value: state.rows.length },
    { label: "Missing", value: state.rows.filter((row) => row.missing).length },
    { label: "Errors", value: state.rows.filter((row) => row.level === "error").length },
    { label: "Warnings", value: state.rows.filter((row) => row.level === "warning").length },
    { label: "Doubts", value: state.rows.filter((row) => row.doubt || row.note).length },
  ]);
}

function renderTable() {
  if (!state.rows.length) {
    els.tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">Load files to start comparing original and translation values.</td></tr>`;
    return;
  }

  const visibleRows = state.rows.filter(matchesFilter).filter(matchesSearch);
  if (!visibleRows.length) {
    els.tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">No rows match the current filters.</td></tr>`;
    return;
  }

  els.tableBody.innerHTML = visibleRows.map((row) => `
    <tr class="row-${row.level}${row.doubt ? " row-doubt" : ""}" data-key="${escapeHtml(row.key)}">
      <td>${makeStatusLabel(row.level, row.status)}</td>
      <td><code>${escapeHtml(row.key)}</code></td>
      <td><textarea readonly>${escapeHtml(row.english)}</textarea></td>
      <td><textarea data-field="spanish">${escapeHtml(row.spanish)}</textarea></td>
      <td>
        <textarea class="notes-box" data-field="note">${escapeHtml(row.note)}</textarea>
        <label class="checkbox-line"><input type="checkbox" data-field="doubt" ${row.doubt ? "checked" : ""} /> Mark doubt</label>
      </td>
    </tr>
  `).join("");
}

function matchesFilter(row) {
  if (state.filter === "all") return true;
  if (state.filter === "error") return row.level === "error";
  if (state.filter === "missing") return row.missing;
  if (state.filter === "changed") return row.changed;
  if (state.filter === "doubt") return row.doubt || !!row.note;
  return true;
}

function matchesSearch(row) {
  if (!state.search) return true;
  return [row.key, row.english, row.spanish, row.german, row.note].join(" ").toLowerCase().includes(state.search);
}

function handleTableInput(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  const tr = event.target.closest("tr[data-key]");
  const row = state.rows.find((item) => item.key === tr?.dataset.key);
  if (!row) return;
  if (field === "doubt") row.doubt = event.target.checked;
  else row[field] = event.target.value;
  renderSummary();
}

function exportCurrent() {
  if (!state.rows.length) return;
  downloadText("gui_sp.properties", exportProperties(state.rows));
}

function exportDoubts() {
  const text = collectDoubts(state.rows, (row, idx) => [
    `## ${idx}. ${row.key}`,
    `- Original phrase: ${row.english || "(missing)"}`,
    `- Translation phrase: ${row.spanish || "(empty)"}`,
    `- Note: ${row.note || "(none)"}`,
  ]);
  downloadText("translation_doubts_gui_en.md", text);
}
})();
