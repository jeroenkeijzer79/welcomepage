#!/usr/bin/env python3
"""Synchronize recent Instagram media to optimized, locally hosted thumbnails."""

from __future__ import annotations

import io
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "images" / "instagram"
FEED_FILE = ROOT / "instagram-feed.json"
API_ROOT = "https://graph.instagram.com/v25.0"
MAX_POSTS = 24
MAX_IMAGE_EDGE = 1200
JPEG_QUALITY = 84
TIMEOUT = 30
TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN", "").strip()
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "JeroenIreneWebsite/1.0 (+https://jeroenirene.nl)"})


def api_get(url: str, params: dict | None = None) -> dict:
    request_params = dict(params or {})
    request_params.setdefault("access_token", TOKEN)
    response = SESSION.get(url, params=request_params, timeout=TIMEOUT)
    response.raise_for_status()
    payload = response.json()
    if isinstance(payload, dict) and payload.get("error"):
        raise RuntimeError(f"Instagram API error: {payload['error'].get('message', 'unknown error')}")
    return payload


def safe_name(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "", value)[:100] or "media"


def download_image(url: str, target: Path) -> bool:
    if not url or urlparse(url).scheme != "https":
        return False
    response = SESSION.get(url, timeout=TIMEOUT)
    response.raise_for_status()
    image = Image.open(io.BytesIO(response.content))
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((MAX_IMAGE_EDGE, MAX_IMAGE_EDGE), Image.Resampling.LANCZOS)
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return True


def media_image_url(item: dict) -> str | None:
    if item.get("media_type") == "VIDEO":
        return item.get("thumbnail_url") or item.get("media_url")
    return item.get("media_url") or item.get("thumbnail_url")


def expand_media(item: dict) -> list[dict]:
    if item.get("media_type") != "CAROUSEL_ALBUM":
        return [item]
    media_id = item.get("id")
    if not media_id:
        return []
    children = api_get(
        f"{API_ROOT}/{media_id}/children",
        {"fields": "id,media_type,media_url,thumbnail_url,permalink,timestamp"},
    )
    return children.get("data", [])


def main() -> int:
    if not TOKEN:
        print(
            "Missing INSTAGRAM_ACCESS_TOKEN. Add a valid Instagram API access token "
            "as a repository Actions secret before running this workflow.",
            file=sys.stderr,
        )
        return 2

    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    payload = api_get(
        f"{API_ROOT}/me/media",
        {
            "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
            "limit": str(MAX_POSTS),
            "access_token": TOKEN,
        },
    )
    posts = payload.get("data", [])
    gallery: list[dict] = []
    used_files: set[str] = set()

    for post in posts:
        if not post.get("permalink") or not post.get("id"):
            continue
        try:
            children = expand_media(post)
        except Exception as error:
            print(f"Skipping carousel {post.get('id')}: {error}", file=sys.stderr)
            children = []

        images = []
        for index, child in enumerate(children):
            image_url = media_image_url(child)
            if not image_url:
                continue
            suffix = f"-{index + 1}" if len(children) > 1 else ""
            filename = f"{safe_name(post['id'])}{suffix}.jpg"
            target = IMAGE_DIR / filename
            try:
                download_image(image_url, target)
            except Exception as error:
                print(f"Could not download media {child.get('id', post['id'])}: {error}", file=sys.stderr)
                continue
            used_files.add(filename)
            images.append({
                "src": f"images/instagram/{filename}",
                "alt": (post.get("caption") or "Foto van Jeroen & Irene").strip()[:180],
            })

        if not images:
            continue
        gallery.append({
            "id": str(post["id"]),
            "caption": (post.get("caption") or "").strip()[:500],
            "media_type": post.get("media_type", "IMAGE"),
            "permalink": post["permalink"],
            "timestamp": post.get("timestamp", ""),
            "images": images,
        })

    # Remove only generated image files no longer present in the current feed.
    for old_file in IMAGE_DIR.glob("*.jpg"):
        if old_file.name not in used_files:
            old_file.unlink()

    FEED_FILE.write_text(
        json.dumps(gallery, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Instagram gallery updated: {len(gallery)} posts, {len(used_files)} local images.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
