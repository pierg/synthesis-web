from __future__ import annotations

import os
from collections.abc import Callable
from pathlib import Path

output_path: Path = Path(os.path.dirname(__file__)).parent / "output"

build_path: Path = Path(os.path.dirname(__file__)).parent.parent / "frontend" / "build"

storage_path: Path = output_path / "storage"

# Usage: session_path(_SESSION_ID_)
session_path: Callable[[str], Path] = lambda s: storage_path / f"s_{s}"

# Usage: controller_path(_SESSION_ID_)
controller_path: Callable[str, Path] = (
    lambda s: storage_path / f"s_{s}" / "controllers"
)
