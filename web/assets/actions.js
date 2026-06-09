(function () {
const { collectDoubts, downloadText, escapeHtml, makeStatusLabel, readFileText, setCardState, summaryMarkup } = window.TranslationApp;
const { exportActions } = window.TranslationExporters;
const { parseActionsJava } = window.TranslationParsers;
const { compareActions } = window.TranslationValidators;

const state = {
  original: null,
  translated: null,
  rows: [],
  filter: "all",
  search: "",
};

const els = {
  originalInput: document.getElementById("actionsOriginalInput"),
  translatedInput: document.getElementById("actionsTranslatedInput"),
  originalCard: document.getElementById("actionsOriginalCard"),
  translatedCard: document.getElementById("actionsTranslatedCard"),
  originalName: document.getElementById("actionsOriginalName"),
  translatedName: document.getElementById("actionsTranslatedName"),
  summary: document.getElementById("actionsSummary"),
  cards: document.getElementById("actionsCards"),
  filters: document.getElementById("actionsFilters"),
  search: document.getElementById("actionsSearchInput"),
  validateButton: document.getElementById("validateActionsButton"),
  exportButton: document.getElementById("exportActionsButton"),
  exportDoubtsButton: document.getElementById("exportActionsDoubtsButton"),
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
    renderCards();
  });
  els.search.addEventListener("input", (event) => {
    state.search = event.target.value.toLowerCase();
    renderCards();
  });
  els.validateButton.addEventListener("click", validateAndRender);
  els.exportButton.addEventListener("click", exportCurrent);
  els.exportDoubtsButton.addEventListener("click", exportDoubts);
  els.cards.addEventListener("input", handleCardInput);
  els.cards.addEventListener("change", handleCardInput);
}

async function loadFile(kind, file) {
  const text = await readFileText(file);
  if (!text) return;
  state[kind] = parseActionsJava(text);
  state[kind].filename = file.name;
  els[`${kind}Name`].textContent = file.name;
  setCardState(els[`${kind}Card`], "ok");
  validateAndRender();
}

function validateAndRender() {
  if (!state.original || !state.translated) {
    render();
    return;
  }
  state.rows = compareActions(state.original, state.translated);
  render();
}

function render() {
  renderSummary();
  renderCards();
}

function renderSummary() {
  if (!state.rows.length) {
    els.summary.innerHTML = summaryMarkup([
      { label: "Total actions", value: 0 },
      { label: "Missing", value: 0 },
      { label: "Errors", value: 0 },
      { label: "Warnings", value: 0 },
      { label: "Doubts", value: 0 },
    ]);
    return;
  }
  els.summary.innerHTML = summaryMarkup([
    { label: "Total actions", value: state.rows.length },
    { label: "Missing", value: state.rows.filter((row) => row.missing).length },
    { label: "Errors", value: state.rows.filter((row) => row.level === "error").length },
    { label: "Warnings", value: state.rows.filter((row) => row.level === "warning").length },
    { label: "Doubts", value: state.rows.filter((row) => row.doubt || row.note).length },
  ]);
}

function renderCards() {
  if (!state.rows.length) {
    els.cards.innerHTML = `<article class="empty-state card-empty">Load files to start comparing original and translation action aliases.</article>`;
    return;
  }

  const visibleRows = state.rows.filter(matchesFilter).filter(matchesSearch);
  if (!visibleRows.length) {
    els.cards.innerHTML = `<article class="empty-state card-empty">No actions match the current filters.</article>`;
    return;
  }

  els.cards.innerHTML = visibleRows.map((row) => `
    <article class="card row-${row.level}${row.doubt ? " row-doubt" : ""}" data-id="${escapeHtml(row.id)}">
      <div class="card-header">
        <div>
          <h2>${escapeHtml(row.action)}</h2>
          <div class="meta">Occurrence #${row.order}</div>
        </div>
        <div>${makeStatusLabel(row.level, row.status)}</div>
      </div>

      <div class="card-grid">
        <div class="column">
          <label>Original aliases</label>
          <textarea readonly>${escapeHtml(row.english)}</textarea>
        </div>
        <div class="column">
          <label>Translation aliases</label>
          <textarea data-field="spanish">${escapeHtml(row.spanish)}</textarea>
        </div>
      </div>

      <div class="column" style="margin-top:12px;">
        <label>Notes</label>
        <textarea class="notes-box" data-field="note">${escapeHtml(row.note)}</textarea>
        <label class="checkbox-line"><input type="checkbox" data-field="doubt" ${row.doubt ? "checked" : ""}/> Mark doubt</label>
      </div>
    </article>
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
  return [row.action, row.english, row.spanish, row.german, row.note].join(" ").toLowerCase().includes(state.search);
}

function handleCardInput(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  const card = event.target.closest("article[data-id]");
  const row = state.rows.find((item) => item.id === card?.dataset.id);
  if (!row) return;
  if (field === "doubt") row.doubt = event.target.checked;
  else row[field] = event.target.value;
  renderSummary();
}

function exportCurrent() {
  if (!state.original || !state.rows.length) return;
  const translatedEntries = state.rows.map((row) => ({
    id: row.id,
    order: row.order,
    action: row.action,
    phrases: row.spanish,
  }));
  const payload = {
    wakePhrases: state.translated?.wakePhrases?.length ? state.translated.wakePhrases : state.original.wakePhrases,
    listenPrefixes: state.translated?.listenPrefixes?.length ? state.translated.listenPrefixes : state.original.listenPrefixes,
    entries: translatedEntries,
  };
  downloadText("SpanishAiActionAliases.java", exportActions(state.original.raw, payload, "SpanishAiActionAliases"));
}

function exportDoubts() {
  const text = collectDoubts(state.rows, (row, idx) => [
    `## ${idx}. ${row.action} (#${row.order})`,
    `- Original phrase: ${row.english || "(missing)"}`,
    `- Translation phrase: ${row.spanish || "(empty)"}`,
    `- Note: ${row.note || "(none)"}`,
  ]);
  downloadText("translation_doubts_actions_en.md", text);
}
})();
