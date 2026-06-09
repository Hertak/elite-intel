# Spanish Translation Doubts

Use this file to track ambiguous or context-sensitive translations.

## Entry format

- File:
- Key / command:
- Source English phrase:
- German reference:
- Proposed Spanish options:
- Reason for doubt / context note:

---

## Open doubts

### 1) Carrier terminology policy
- File: `SpanishAiActionAliases.java`, `gui_sp.properties`
- Key / command: Multiple `fleet carrier` / `carrier` occurrences
- Source English phrase: `fleet carrier`, `carrier`
- German reference: `fleet carrier`, `carrier`, `träger`
- Proposed Spanish options:
  - Keep `Fleet Carrier` / `carrier`
  - Translate to `portanaves de flota`
  - Mixed form: `Fleet Carrier` in UI, `carrier` in aliases
- Reason for doubt / context note: In Elite Dangerous communities, English canon terms are often kept. A literal Spanish translation may sound less natural than player usage.

### 2) Drive Assist
- File: `SpanishAiActionAliases.java`, `gui_sp.properties`
- Key / command: `command.drive_assist.*`, alias `DRIVE_ASSIST`
- Source English phrase: `Drive Assist`
- German reference: `Drive Assist`, `Fahrhilfe`
- Proposed Spanish options:
  - `Drive Assist`
  - `Asistencia de conducción`
  - `Asistente de conducción`
- Reason for doubt / context note: UI may benefit from preserving the in-game English label if the game client exposes it untranslated for many players.

### 3) Stronghold systems
- File: `gui_sp.properties`, `SpanishAiActionAliases.java`
- Key / command: trade profile stronghold settings
- Source English phrase: `Stronghold Systems`
- German reference: `Stronghold-Systeme`, `festungen`
- Proposed Spanish options:
  - `Stronghold Systems`
  - `Sistemas Stronghold`
  - `Sistemas de bastión`
- Reason for doubt / context note: This is game-specific terminology and should match established Elite Dangerous usage if one exists.

### 4) Cadence
- File: `gui_sp.properties`
- Key / command: `player.fleet.cadence`
- Source English phrase: `Cadence`
- German reference: `Tonfall`
- Proposed Spanish options:
  - `Cadencia`
  - `Entonación`
  - `Estilo de habla`
- Reason for doubt / context note: The setting appears voice-related rather than musical. `Cadencia` is literal, but may be less clear in UI than `Entonación`.

### 5) Hardpoints
- File: `SpanishAiActionAliases.java`, `gui_sp.properties`
- Key / command: `deploy/retract hardpoints`
- Source English phrase: `Hardpoints`
- German reference: `Hardpoints`, `Waffenaufhängungen`
- Proposed Spanish options:
  - `hardpoints`
  - `anclajes de armas`
  - `soportes de armas`
- Reason for doubt / context note: Players often use the English term. A literal translation may be technically clearer but less recognizable to the target audience.

### 6) Earl rank title
- File: `gui_sp.properties`
- Key / command: `ranks.imperial.earl`
- Source English phrase: `Earl`
- German reference: `Earl`
- Proposed Spanish options:
  - Keep `Earl`
  - Translate to `Conde` (rejected because `Count` already maps to `Conde`)
- Reason for doubt / context note: Kept as `Earl` because there is no clean one-to-one Spanish title here and translating it would collapse distinction with `Count`.

### 7) Drive Assist display vs spoken policy
- File: `SpanishAiActionAliases.java`, `gui_sp.properties`
- Key / command: `command.drive_assist.*`, alias `DRIVE_ASSIST`
- Source English phrase: `Drive Assist`
- German reference: `Drive Assist`, `Fahrhilfe`
- Proposed Spanish options:
  - UI keeps `Drive Assist`
  - Spoken aliases use `asistencia de conducción` / `asistente de conducción`
- Reason for doubt / context note: Resolved as a split policy. UI preserves the game-facing label for recognition; voice aliases accept natural Spanish phrases.
