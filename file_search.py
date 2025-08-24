import os
from typing import List, Tuple

IGNORE_DIR_NAMES = ["node_modules", "__pycache__", ".git"]
MAX_RESULTS = 50
MAX_DEPTH = 5

def _should_skip_dir(dir_name: str) -> bool:
    return dir_name in IGNORE_DIR_NAMES or dir_name.startswith(".")

def search_files(
    query: str,
    root_dir: str,
    max_results: int = MAX_RESULTS,
    max_depth: int = MAX_DEPTH,
) -> List[Tuple[str, int]]:
    query_lower = query.lower()
    results: List[Tuple[str, int]] = []
    queue: List[Tuple[str, int]] = [(root_dir, 0)]

    while queue and len(results) < max_results:
        dir_path, depth = queue.pop(0)
        if depth > max_depth:
            continue
        try:
            with os.scandir(dir_path) as it:
                for entry in it:
                    try:
                        if entry.is_dir(follow_symlinks=False):
                            if not _should_skip_dir(entry.name):
                                queue.append((entry.path, depth + 1))
                        else:
                            if query_lower in entry.name.lower():
                                size = entry.stat(follow_symlinks=False).st_size
                                results.append((entry.path, size))
                                if len(results) >= max_results:
                                    break
                    except Exception:
                        continue
        except Exception:
            continue
    return results
