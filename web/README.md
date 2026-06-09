# Elite Intel Translation Helper

Small client-side helper to compare and validate original and translation files.

## Pages

- `index.html` — start screen
- `gui.html` — compare original and translation `.properties` files
- `actions.html` — compare original and translation AI action alias Java files

## Usage

Open `index.html` in the browser and load files manually.

Recommended file sets:

### GUI
- Original: `gui.properties`
- Translated: `gui_sp.properties`

### Actions
- Original: `EnglishAiActionAliases.java`
- Translated: `SpanishAiActionAliases.java`

## Current scope

- client-side only
- no database
- validation-first workflow
- export translated file
- export doubts markdown

## Known limitations

- `.properties` export currently writes key/value lines only and does not preserve comments or original grouping
- action export preserves the original Java structure by replacing `Set.of(...)` and `map.put(...)` string content from the loaded source file
- wake/listen phrases are validated and exported from the loaded translated file, but there is no dedicated editor for them yet
