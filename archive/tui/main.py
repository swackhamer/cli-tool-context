from __future__ import annotations

from pathlib import Path

from .app import ToolsBrowserApp


def main() -> None:
    # repo root is parent of this tui package directory
    repo_root = Path(__file__).resolve().parents[1]
    app = ToolsBrowserApp(repo_root=repo_root)
    app.run()


if __name__ == "__main__":
    main()
