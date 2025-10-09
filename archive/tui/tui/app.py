from __future__ import annotations

import os
import shlex
import subprocess
from pathlib import Path
from typing import List, Optional

from textual.app import App, ComposeResult
from textual.containers import Horizontal, Vertical
from textual.reactive import reactive
from textual.widgets import Footer, Header, Input, Label, ListItem, ListView, Markdown


class ToolsBrowserApp(App):
    """
    Two-pane TUI for browsing markdown files in the repo's tools directory.

    Left pane: list of markdown files under tools/
    Right pane: markdown preview of the currently highlighted file

    Key bindings:
      Up / k      - move up
      Down / j    - move down
      Enter       - toggle preview full screen (hide/show list)
      /           - start filtering by substring
      o           - open selected file in $EDITOR/$VISUAL or `less -R`
      q           - quit
      Esc (in filter) - clear filter and hide bar
    """

    CSS = """
    Screen {
        layout: vertical;
    }

    #body {
        height: 1fr;
    }

    #left {
        width: 36;
        min-width: 24;
        max-width: 64;
        border: solid gray;
    }

    #right {
        border: solid gray;
    }

    .hidden {
        display: none;
    }

    #filterbar {
        height: 3;
        border: tall $surface 0%;
    }
    """

    BINDINGS = [
        ("up", "cursor_up", "Up"),
        ("down", "cursor_down", "Down"),
        ("k", "cursor_up", "Up"),
        ("j", "cursor_down", "Down"),
        ("enter", "toggle_fullscreen", "Full"),
        ("/", "start_filter", "Filter"),
        ("o", "open_editor", "Open"),
        ("q", "quit", "Quit"),
    ]

    repo_root: Path
    tools_dir: Path

    _all_files: List[Path] = reactive([])        # full list from discovery
    _shown_files: List[Path] = reactive([])      # currently filtered list
    _filter_text: str = reactive("")
    _fullscreen: bool = reactive(False)

    def __init__(self, repo_root: Path, **kwargs):
        super().__init__(**kwargs)
        self.repo_root = repo_root
        self.tools_dir = self.repo_root / "tools"

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        with Horizontal(id="body"):
            yield ListView(id="left")
            with Vertical(id="right"):
                yield Markdown("Select a file from the list.", id="md")
        with Horizontal(id="filterbar"):
            yield Label("Filter: ")
            yield Input(placeholder="type to filter; Esc clears", id="filter")
        yield Footer()

    def on_mount(self) -> None:
        # Hide filter bar initially
        self.query_one("#filterbar").add_class("hidden")
        # Discover files and populate
        files = self.discover_files()
        self._all_files = files
        self.apply_filter()  # initializes _shown_files and list view
        # Focus the list for navigation
        self.query_one(ListView).focus()

    # ---------- File discovery and list population ----------
    def discover_files(self) -> List[Path]:
        if not self.tools_dir.exists():
            return []
        files = [p for p in self.tools_dir.glob("*.md") if p.is_file() and not p.name.startswith(".")]
        # Ensure README.md is included if present (tools/README.md)
        readme = self.tools_dir / "README.md"
        if readme.exists() and readme not in files:
            files.append(readme)
        files.sort(key=lambda p: p.name.lower())
        return files

    def populate_list(self, files: List[Path]) -> None:
        lv = self.query_one(ListView)
        lv.clear()
        for p in files:
            lv.append(ListItem(Label(p.name)))
        if files:
            lv.index = 0
            self.update_preview_from_index(0)
        else:
            self.query_one(Markdown).update("No markdown files found in tools/.")

    # ---------- Filtering ----------
    def action_start_filter(self) -> None:
        bar = self.query_one("#filterbar")
        bar.remove_class("hidden")
        self.query_one(Input).focus()

    def on_input_changed(self, event: Input.Changed) -> None:
        if event.input.id == "filter":
            self._filter_text = event.value
            self.apply_filter()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        # Keep filter open; user can continue typing
        pass

    def on_input_key(self, event: Input.Key) -> None:
        # Escape clears and hides filter
        if event.input.id == "filter" and event.key == "escape":
            event.input.value = ""
            self._filter_text = ""
            self.apply_filter()
            self.query_one("#filterbar").add_class("hidden")
            self.query_one(ListView).focus()

    def apply_filter(self) -> None:
        substr = (self._filter_text or "").lower()
        files = self._all_files
        if substr:
            files = [p for p in files if substr in p.name.lower()]
        self._shown_files = files
        self.populate_list(files)

    # ---------- Navigation and selection ----------
    def action_cursor_up(self) -> None:
        self.query_one(ListView).action_cursor_up()
        self.update_preview_from_current()

    def action_cursor_down(self) -> None:
        self.query_one(ListView).action_cursor_down()
        self.update_preview_from_current()

    def on_list_view_highlighted(self, event: ListView.Highlighted) -> None:  # type: ignore[attr-defined]
        # Update preview on highlight change
        self.update_preview_from_current()

    def update_preview_from_current(self) -> None:
        lv = self.query_one(ListView)
        index = lv.index if lv.index is not None else 0
        self.update_preview_from_index(index)

    def update_preview_from_index(self, index: int) -> None:
        if not self._shown_files:
            return
        index = max(0, min(index, len(self._shown_files) - 1))
        p = self._shown_files[index]
        self.refresh_preview(p)

    # ---------- Preview and external open ----------
    def read_text(self, p: Path) -> str:
        try:
            return p.read_text(encoding="utf-8", errors="replace")
        except Exception as e:  # noqa: BLE001 - show error to user
            return f"# Error\n\nCould not read file `{p}`: {e}"

    def refresh_preview(self, p: Optional[Path]) -> None:
        md = self.query_one(Markdown)
        if not p:
            md.update("Select a file from the list.")
            return
        content = self.read_text(p)
        md.update(content)

    def action_open_editor(self) -> None:
        lv = self.query_one(ListView)
        idx = lv.index if lv.index is not None else 0
        if not self._shown_files:
            return
        p = self._shown_files[idx]
        editor = os.environ.get("EDITOR") or os.environ.get("VISUAL")
        if editor:
            cmd = shlex.split(editor) + [str(p)]
        else:
            cmd = ["less", "-R", str(p)]
        # Suspend TUI while external program runs
        with self.suspend():
            try:
                subprocess.run(cmd, check=False)
            except FileNotFoundError:
                # Fall back to TextEdit on macOS
                subprocess.run(["open", "-e", str(p)], check=False)
        # Reload in case of edits
        self.refresh_preview(p)

    # ---------- Fullscreen and quit ----------
    def action_toggle_fullscreen(self) -> None:
        self._fullscreen = not self._fullscreen
        left = self.query_one("#left")
        if self._fullscreen:
            left.add_class("hidden")
        else:
            left.remove_class("hidden")

    def action_quit(self) -> None:
        self.exit()
