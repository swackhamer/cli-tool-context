"""Compatibility shim for the old module name `tools_tui`.

This package forwards imports to the canonical `tui` package.
"""

from tui import ToolsBrowserApp, __version__

__all__ = ["ToolsBrowserApp", "__version__"]
