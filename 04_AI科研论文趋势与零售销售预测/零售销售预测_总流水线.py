"""One-command orchestration for the retail sales analysis and forecast project."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import importlib.metadata
import json
import os
import platform
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import yaml


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = PROJECT_ROOT / "config" / "pipeline.yaml"
PACKAGE_NAMES = ["pandas", "numpy", "scipy", "statsmodels", "scikit-learn", "PyYAML"]


def now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def json_default(value: Any) -> Any:
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, (dt.datetime, dt.date)):
        return value.isoformat()
    return str(value)


def write_manifest(path: Path, manifest: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, default=json_default), encoding="utf-8")


def package_versions() -> dict[str, str]:
    versions: dict[str, str] = {}
    for name in PACKAGE_NAMES:
        try:
            versions[name] = importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:
            versions[name] = "not-installed"
    return versions


def resolve_path(root: Path, value: str | Path) -> Path:
    path = Path(value)
    return path if path.is_absolute() else root / path


def run_stage(root: Path, python: str, stage: dict[str, Any], log_dir: Path, env: dict[str, str]) -> dict[str, Any]:
    stage_id = str(stage["id"])
    script = resolve_path(root, stage["script"])
    args = [str(item) for item in stage.get("args", [])]
    command = [python, str(script), *args]
    log_path = log_dir / f"{stage_id}.log"
    started = now()
    start_clock = time.perf_counter()
    with log_path.open("w", encoding="utf-8") as log:
        log.write(f"$ {' '.join(command)}\n")
        log.write(f"started_at={started}\n\n")
        result = subprocess.run(command, cwd=root, env=env, stdout=log, stderr=subprocess.STDOUT, text=True, check=False)
    ended = now()
    record = {
        "id": stage_id,
        "script": str(script.relative_to(root)) if script.is_relative_to(root) else str(script),
        "command": command,
        "status": "passed" if result.returncode == 0 else "failed",
        "exit_code": int(result.returncode),
        "started_at": started,
        "ended_at": ended,
        "duration_seconds": round(time.perf_counter() - start_clock, 3),
        "log": str(log_path.relative_to(root)),
    }
    if result.returncode != 0:
        record["error"] = f"阶段 {stage_id} 返回退出码 {result.returncode}，详见 {record['log']}"
    return record


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--seed", type=int, default=None)
    args = parser.parse_args()
    config_path = resolve_path(PROJECT_ROOT, args.config)
    config = yaml.safe_load(config_path.read_text(encoding="utf-8"))
    input_path = resolve_path(PROJECT_ROOT, config["input"]["file"])
    output_root = resolve_path(PROJECT_ROOT, config["outputs"]["root"])
    log_dir = resolve_path(PROJECT_ROOT, config["outputs"]["logs"])
    manifest_path = resolve_path(PROJECT_ROOT, config["outputs"]["manifest"])
    log_dir.mkdir(parents=True, exist_ok=True)
    seed = int(args.seed if args.seed is not None else config["runtime"]["random_seed"])
    source_hash_before = sha256(input_path)
    expected_hash = str(config["input"]["expected_sha256"])
    if source_hash_before != expected_hash:
        raise SystemExit(f"源文件SHA-256与pipeline合同不一致: {source_hash_before}")

    env = os.environ.copy()
    env["PYTHONHASHSEED"] = str(seed)
    env["PIPELINE_RANDOM_SEED"] = str(seed)
    manifest: dict[str, Any] = {
        "pipeline_version": config["pipeline_version"],
        "project": config["project"],
        "status": "running",
        "started_at": now(),
        "finished_at": None,
        "project_root": str(PROJECT_ROOT),
        "input": {"file": str(input_path.relative_to(PROJECT_ROOT)), "encoding": config["input"]["encoding"], "sha256_before": source_hash_before, "expected_sha256": expected_hash},
        "runtime": {"python": sys.executable, "python_version": platform.python_version(), "platform": platform.platform(), "seed": seed, "packages": package_versions(), "config": str(config_path.relative_to(PROJECT_ROOT)), "config_sha256": sha256(config_path)},
        "stages": [],
    }
    write_manifest(manifest_path, manifest)
    print(f"[pipeline] start {manifest['started_at']} seed={seed}")
    for stage in config["stages"]:
        stage_id = str(stage["id"])
        print(f"[pipeline] running {stage_id} ...", flush=True)
        record = run_stage(PROJECT_ROOT, sys.executable, stage, log_dir, env)
        manifest["stages"].append(record)
        write_manifest(manifest_path, manifest)
        print(f"[pipeline] {record['status']} {stage_id} ({record['duration_seconds']}s)", flush=True)
        if record["status"] != "passed":
            manifest["status"] = "failed"
            manifest["failed_stage"] = stage_id
            manifest["finished_at"] = now()
            manifest["input"]["sha256_after"] = sha256(input_path)
            write_manifest(manifest_path, manifest)
            return int(record["exit_code"] or 1)

    source_hash_after = sha256(input_path)
    manifest["input"]["sha256_after"] = source_hash_after
    manifest["input"]["raw_modified"] = source_hash_before != source_hash_after
    manifest["status"] = "completed" if not manifest["input"]["raw_modified"] else "failed"
    manifest["finished_at"] = now()
    manifest["outputs"] = {
        "quality": "outputs/quality",
        "standard_tables": "outputs/analysis_tables",
        "descriptive": "outputs/analysis/descriptive",
        "impact": "outputs/analysis/impact",
        "forecast": "outputs/analysis/forecast",
        "validation": "outputs/validation/pipeline_output_validation.json",
    }
    write_manifest(manifest_path, manifest)
    if manifest["status"] != "completed":
        print("[pipeline] FAILED: 原始data.csv哈希发生变化", file=sys.stderr)
        return 2
    print(f"[pipeline] completed {manifest['finished_at']}")
    print(f"[pipeline] manifest={manifest_path.relative_to(PROJECT_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
