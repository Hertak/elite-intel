# Elite Intel Translation Helper

Small client-side helper to compare and validate original and translation files.

## Pages

- `web/index.html` — start screen
- `web/gui.html` — compare original and translation `.properties` files
- `web/actions.html` — compare original and translation AI action alias Java files

## Usage

Open `web/index.html` in the browser and load your files manually.

## Current scope

- client-side only
- no database
- validation-first workflow
- export translation file
- export doubts markdown

## Known limitations

- `.properties` export currently writes key/value lines only and does not preserve comments or original grouping
- action export preserves the original Java structure by replacing `Set.of(...)` and `map.put(...)` string content from the loaded source file
- wake/listen phrases are validated and exported from the loaded translated file, but there is no dedicated editor for them yet
