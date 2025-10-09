# Tools Markdown Browser (TUI)

A small terminal UI to browse the Markdown files under the tools/ directory of this repository.

Features
- Two-pane layout: file list on the left, Markdown preview on the right
- Keyboard navigation (Up/Down, j/k)
- Toggle full-screen preview (Enter)
- Live filter (press /)
- Open in external editor (o) using $EDITOR/$VISUAL, falling back to less -R or TextEdit

Prerequisites
- Python 3.10+ (repo is configured for Python 3.13 via pyenv on your system)
- Recommended: uv (or use pip)

Install dependencies
- With uv:
  uv pip install textual

- Or with pip:
  python -m pip install --upgrade pip
  python -m pip install textual

Run
- From the repository root:
  python -m tui

Or run the module directly:
  python tui/main.py

Key bindings
- Up / k: Move up in the file list
- Down / j: Move down in the file list
- Enter: Toggle full-screen preview (hide/show file list)
- /: Start filtering by substring (Esc to clear and hide filter)
- o: Open selected file in $EDITOR or $VISUAL, or fallback to less/TextEdit
- q: Quit

Notes
- Files are discovered in tools/ with the .md extension, including tools/README.md if present.
- Files are read as UTF-8 with errors replaced.
- Preview is scrollable; use standard terminal scrolling or PageUp/PageDown.

Troubleshooting
- If the UI doesn't start, ensure textual is installed (see above).
- If your editor doesn't open with 'o', set EDITOR or VISUAL in your shell.
