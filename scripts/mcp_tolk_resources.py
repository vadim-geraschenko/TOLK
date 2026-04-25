#!/usr/bin/env python3
from __future__ import annotations

import json
import mimetypes
import sys
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]


def log(message: str) -> None:
    print(message, file=sys.stderr, flush=True)


def send_message(payload: dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n")
    sys.stdout.flush()



def read_message() -> dict[str, Any] | None:
    line = sys.stdin.readline()
    if not line:
        return None
    return json.loads(line)
    
    
    while True:
        line = sys.stdin.buffer.readline()
        if not line:
            return None

        if line in (b"\r\n", b"\n"):
            break

        name, sep, value = line.decode("utf-8").partition(":")
        if not sep:
            continue
        headers[name.strip().lower()] = value.strip()

    try:
        content_length = int(headers.get("content-length", "0"))
    except ValueError:
        return None

    if content_length <= 0:
        return None

    body = sys.stdin.buffer.read(content_length)
    if len(body) != content_length:
        return None

    return json.loads(body.decode("utf-8"))


def make_response(message_id: Any, result: dict[str, Any]) -> dict[str, Any]:
    return {"jsonrpc": "2.0", "id": message_id, "result": result}


def make_error(message_id: Any, code: int, message: str) -> dict[str, Any]:
    return {
        "jsonrpc": "2.0",
        "id": message_id,
        "error": {"code": code, "message": message},
    }


def guess_mime_type(path: Path) -> str:
    mime_type, _ = mimetypes.guess_type(str(path))
    return mime_type or "text/plain"


def relative_posix(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


def safe_file_under_repo(rel: str) -> Path:
    file_path = (REPO_ROOT / rel).resolve()
    if not file_path.is_relative_to(REPO_ROOT):
        raise FileNotFoundError(rel)
    return file_path


def docs_resources() -> list[dict[str, Any]]:
    patterns = [
        "docs/design/**/*.md",
        "docs/design/pages/home/source/home-mvp.html",
        "docs/design/pages/about/source/about.html",
    ]

    files: list[Path] = []
    for pattern in patterns:
        files.extend(REPO_ROOT.glob(pattern))

    resources: list[dict[str, Any]] = []
    seen: set[str] = set()

    for file_path in sorted(files):
        if not file_path.is_file():
            continue

        rel = relative_posix(file_path)
        if rel in seen:
            continue
        seen.add(rel)

        resources.append(
            {
                "uri": f"tolk-docs://{rel}",
                "name": rel,
                "title": rel,
                "description": f"TOLK design source file: {rel}",
                "mimeType": guess_mime_type(file_path),
            }
        )

    return resources


def docs_read(uri: str) -> dict[str, Any]:
    prefix = "tolk-docs://"
    if not uri.startswith(prefix):
        raise FileNotFoundError(uri)

    rel = uri.removeprefix(prefix)
    file_path = safe_file_under_repo(rel)

    if not file_path.is_file():
        raise FileNotFoundError(rel)

    return {
        "contents": [
            {
                "uri": uri,
                "mimeType": guess_mime_type(file_path),
                "text": file_path.read_text(encoding="utf-8", errors="replace"),
            }
        ]
    }


def snapshot_files() -> list[Path]:
    patterns = [
        "docs/design/pages/home/snapshots/baselines/*.png",
        "docs/design/pages/home/snapshots/current/*.png",
        "docs/design/pages/home/snapshots/diffs/*.png",
        "docs/design/pages/about/snapshots/baselines/*.png",
        "docs/design/pages/about/snapshots/current/*.png",
        "docs/design/pages/about/snapshots/diffs/*.png",
    ]

    files: list[Path] = []
    for pattern in patterns:
        files.extend(REPO_ROOT.glob(pattern))

    return sorted(path for path in files if path.is_file())


def snapshot_parts(rel: str) -> tuple[str, str, str]:
    parts = rel.split("/")
    if len(parts) < 7:
        return "unknown", "unknown", Path(rel).name
    return parts[3], parts[5], parts[6]


def snapshot_resource_for(path: Path) -> dict[str, Any]:
    rel = relative_posix(path)
    page, collection, filename = snapshot_parts(rel)
    stat = path.stat()

    return {
        "uri": f"tolk-snapshots://{rel}",
        "name": filename,
        "title": filename,
        "description": f"{page} {collection} snapshot metadata",
        "mimeType": "application/json",
        "annotations": {
            "page": page,
            "collection": collection,
        },
        "sizeBytes": stat.st_size,
        "mtime": stat.st_mtime,
    }


def snapshot_index(page_filter: str | None = None) -> dict[str, Any]:
    items: list[dict[str, Any]] = []

    for file_path in snapshot_files():
        rel = relative_posix(file_path)
        page, collection, filename = snapshot_parts(rel)

        if page_filter and page != page_filter:
            continue

        stat = file_path.stat()
        items.append(
            {
                "page": page,
                "collection": collection,
                "filename": filename,
                "relativePath": rel,
                "absolutePath": str(file_path),
                "sizeBytes": stat.st_size,
                "mtime": stat.st_mtime,
            }
        )

    return {"items": items}


def snapshot_resources() -> list[dict[str, Any]]:
    resources: list[dict[str, Any]] = [
        {
            "uri": "tolk-snapshots://index",
            "name": "snapshot-index",
            "title": "snapshot-index",
            "description": "All TOLK snapshot metadata",
            "mimeType": "application/json",
        },
        {
            "uri": "tolk-snapshots://page/home",
            "name": "home-snapshot-index",
            "title": "home-snapshot-index",
            "description": "Home snapshot metadata",
            "mimeType": "application/json",
        },
        {
            "uri": "tolk-snapshots://page/about",
            "name": "about-snapshot-index",
            "title": "about-snapshot-index",
            "description": "About snapshot metadata",
            "mimeType": "application/json",
        },
    ]

    resources.extend(snapshot_resource_for(path) for path in snapshot_files())
    return resources


def snapshots_read(uri: str) -> dict[str, Any]:
    if uri == "tolk-snapshots://index":
        payload = snapshot_index()
    elif uri == "tolk-snapshots://page/home":
        payload = snapshot_index("home")
    elif uri == "tolk-snapshots://page/about":
        payload = snapshot_index("about")
    else:
        prefix = "tolk-snapshots://"
        if not uri.startswith(prefix):
            raise FileNotFoundError(uri)

        rel = uri.removeprefix(prefix)
        file_path = safe_file_under_repo(rel)

        if not file_path.is_file():
            raise FileNotFoundError(rel)

        page, collection, filename = snapshot_parts(rel)
        stat = file_path.stat()

        payload = {
            "page": page,
            "collection": collection,
            "filename": filename,
            "relativePath": rel,
            "absolutePath": str(file_path),
            "sizeBytes": stat.st_size,
            "mtime": stat.st_mtime,
        }

    return {
        "contents": [
            {
                "uri": uri,
                "mimeType": "application/json",
                "text": json.dumps(payload, ensure_ascii=False, indent=2),
            }
        ]
    }


def server_name(mode: str) -> str:
    return "tolk-design-docs" if mode == "docs" else "tolk-snapshots"


def resources_list(mode: str) -> dict[str, Any]:
    resources = docs_resources() if mode == "docs" else snapshot_resources()
    return {"resources": resources}


def resources_read(mode: str, uri: str) -> dict[str, Any]:
    if mode == "docs":
        return docs_read(uri)
    return snapshots_read(uri)


def initialize_response(mode: str, request: dict[str, Any]) -> dict[str, Any]:
    params = request.get("params") or {}
    requested_version = params.get("protocolVersion")

    if not isinstance(requested_version, str) or not requested_version:
        requested_version = "2025-06-18"

    name = server_name(mode)

    return make_response(
        request.get("id"),
        {
            "protocolVersion": requested_version,
            "capabilities": {
                "resources": {
                    "subscribe": False,
                    "listChanged": False,
                }
            },
            "serverInfo": {
                "name": name,
                "title": name,
                "version": "0.1.0",
            },
            "instructions": "Provides TOLK design docs and snapshot metadata as MCP resources.",
        },
    )


def handle_request(mode: str, request: dict[str, Any]) -> dict[str, Any] | None:
    method = request.get("method")
    message_id = request.get("id")

    try:
        if method == "initialize":
            return initialize_response(mode, request)

        if method == "notifications/initialized":
            return None

        if method == "ping":
            return make_response(message_id, {})

        if method == "resources/list":
            return make_response(message_id, resources_list(mode))

        if method == "resources/templates/list":
            return make_response(message_id, {"resourceTemplates": []})

        if method == "resources/read":
            params = request.get("params") or {}
            uri = params.get("uri")

            if not isinstance(uri, str):
                return make_error(message_id, -32602, "Missing resource URI")

            return make_response(message_id, resources_read(mode, uri))

        if method == "tools/list":
            return make_response(message_id, {"tools": []})

        if method == "prompts/list":
            return make_response(message_id, {"prompts": []})

        return make_error(message_id, -32601, f"Method not found: {method}")

    except FileNotFoundError as exc:
        return make_error(message_id, -32002, f"Resource not found: {exc}")

    except Exception as exc:
        log(f"error while handling {method}: {type(exc).__name__}: {exc}")
        return make_error(message_id, -32603, "Internal server error")


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in {"docs", "snapshots"}:
        print("Usage: mcp_tolk_resources.py [docs|snapshots]", file=sys.stderr)
        sys.exit(1)

    mode = sys.argv[1]
    log(f"{server_name(mode)} starting")

    while True:
        try:
            message = read_message()
        except Exception as exc:
            log(f"failed to read message: {type(exc).__name__}: {exc}")
            break

        if message is None:
            break

        response = handle_request(mode, message)
        if response is not None:
            send_message(response)

    log(f"{server_name(mode)} stopped")


if __name__ == "__main__":
    main()
