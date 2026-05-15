#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MP4_PATH = ROOT / "10-videos" / "heygen-source.mp4"
VO_DIR = ROOT / "02-heygen-vo"
TIMINGS_PATH = Path(__file__).parent / "segment-timings.json"
AUDIO_TMP = Path("/tmp/video12-audio.mp3")


def load_api_key() -> tuple[str, str]:
    candidates: list[tuple[str, str]] = []
    for envfile in [ROOT.parent / ".env", ROOT / ".env", Path.home() / ".config/watch/.env"]:
        if not envfile.exists():
            continue
        for line in envfile.read_text().splitlines():
            if "=" not in line:
                continue
            key, _, val = line.partition("=")
            clean = val.strip().strip('"').strip("'")
            if key.strip() == "OPENAI_API_KEY" and clean:
                candidates.append(("openai", clean))
            if key.strip() == "GROQ_API_KEY" and clean:
                candidates.append(("groq", clean))
    for backend, key in candidates:
        if backend == "openai":
            return backend, key
    if candidates:
        return candidates[0]
    sys.exit("ERROR: no OPENAI_API_KEY or GROQ_API_KEY found")


def extract_audio() -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(MP4_PATH),
            "-vn",
            "-acodec",
            "libmp3lame",
            "-ar",
            "16000",
            "-ac",
            "1",
            "-b:a",
            "64k",
            str(AUDIO_TMP),
        ],
        check=True,
    )


def transcribe(backend: str, api_key: str) -> dict:
    if backend == "openai":
        url = "https://api.openai.com/v1/audio/transcriptions"
        model = "whisper-1"
    else:
        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        model = "whisper-large-v3"
    result = subprocess.run(
        [
            "curl",
            "-sS",
            "--fail-with-body",
            url,
            "-H",
            f"Authorization: Bearer {api_key}",
            "-F",
            f"file=@{AUDIO_TMP}",
            "-F",
            f"model={model}",
            "-F",
            "response_format=verbose_json",
            "-F",
            "timestamp_granularities[]=word",
            "-F",
            "language=en",
        ],
        capture_output=True,
        text=True,
        timeout=300,
    )
    if result.returncode != 0:
        sys.exit(f"curl failed: {result.stderr}\n{result.stdout[:1500]}")
    return json.loads(result.stdout)


def normalize(s: str) -> list[str]:
    s = re.sub(r"[-']", " ", s.lower())
    s = re.sub(r"[^\w\s]", "", s)
    return s.split()


def align(transcript: dict) -> list[dict]:
    words = transcript.get("words", [])
    tokens = []
    for word in words:
        normalized = normalize(word["word"])
        tokens.append(normalized[0] if normalized else "")

    def find_match(needle: list[str], cursor: int) -> int | None:
        head = needle[:8]
        for window in (7, 6, 5, 4):
            if len(head) < window:
                continue
            for i in range(cursor, len(tokens) - window + 1):
                if all(tokens[i + j] == head[j] for j in range(window)):
                    return i
        for i in range(cursor, max(cursor, len(tokens) - 5)):
            target = head[:5]
            hits = sum(1 for j in range(min(5, len(target))) if tokens[i + j] == target[j])
            if hits >= 4 and tokens[i] == target[0]:
                return i
        return None

    timings = []
    cursor = 0
    for seg in range(1, 33):
        text = (VO_DIR / f"segment-{seg:03d}.txt").read_text()
        seg_tokens = normalize(text)
        found = find_match(seg_tokens, cursor)
        if found is None:
            print(f"seg {seg:02d}: no match for {' '.join(seg_tokens[:6])}", file=sys.stderr)
            continue
        timings.append({"seg": seg, "start": float(words[found]["start"]), "first_tokens": " ".join(seg_tokens[:5])})
        cursor = found + 1

    duration = float(transcript.get("duration") or words[-1]["end"])
    for i, timing in enumerate(timings):
        end = timings[i + 1]["start"] if i + 1 < len(timings) else duration
        timing["start"] = round(timing["start"], 3)
        timing["end"] = round(float(end), 3)
        timing["duration"] = round(timing["end"] - timing["start"], 3)
    return timings


def main() -> int:
    if not MP4_PATH.exists():
        sys.exit(f"ERROR: missing {MP4_PATH}")
    raw_path = Path(__file__).parent / "transcript-raw.json"
    if raw_path.exists() and "--retranscribe" not in sys.argv:
        transcript = json.loads(raw_path.read_text())
    else:
        extract_audio()
        backend, api_key = load_api_key()
        transcript = transcribe(backend, api_key)
        raw_path.write_text(json.dumps(transcript, indent=2))

    timings = align(transcript)
    TIMINGS_PATH.write_text(json.dumps(timings, indent=2))
    print(f"Aligned {len(timings)}/32 segments")
    for timing in timings:
        print(f"{timing['seg']:02d} {timing['start']:8.2f} {timing['end']:8.2f} {timing['duration']:6.2f} {timing['first_tokens']}")
    return 0 if len(timings) == 32 else 1


if __name__ == "__main__":
    sys.exit(main())
