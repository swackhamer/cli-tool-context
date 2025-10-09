"""Simple TUI to browse the markdown files in the tools directory.

Run with:
    python -m tui
or:
    python -m tui.main
"""

__all__ = ["ToolsBrowserApp"]
__version__ = "0.1.0"

from .app import ToolsBrowserApp
