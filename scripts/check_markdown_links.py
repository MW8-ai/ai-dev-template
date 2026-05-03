#!/usr/bin/env python3
"""Check local markdown links without requiring Node or external services."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
LINK_PATTERN = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")


def strip_anchor(target: str) -> str:
    return target.split("#", 1)[0]


def is_external(target: str) -> bool:
    return target.startswith(("http://", "https://", "mailto:", "tel:"))


def main() -> int:
    failures: list[str] = []
    for md_file in ROOT.rglob("*.md"):
        if any(part in {".git", "node_modules"} for part in md_file.parts):
            continue
        text = md_file.read_text(encoding="utf-8", errors="replace")
        for match in LINK_PATTERN.finditer(text):
            raw_target = match.group(1).strip()
            if not raw_target or is_external(raw_target) or raw_target.startswith("#"):
                continue
            target_without_anchor = strip_anchor(raw_target)
            if not target_without_anchor:
                continue
            if target_without_anchor.startswith("/"):
                candidate = ROOT / target_without_anchor.lstrip("/")
            else:
                candidate = md_file.parent / unquote(target_without_anchor)
            if not candidate.exists():
                failures.append(f"{md_file.relative_to(ROOT)} -> {raw_target}")

    if failures:
        print("Local markdown link failures:")
        for failure in failures:
            print(f"::error::{failure}")
        return 1
    print("Local markdown links passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
