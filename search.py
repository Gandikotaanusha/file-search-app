from fastapi import APIRouter, Query
from typing import List, Tuple
from app.services.file_search import search_files  # your file search function

router = APIRouter()

@router.get("/")
def search(
    query: str = Query(..., description="Filename to search"),
    root_dirs: List[str] = Query(..., description="List of root directories"),
):
    results: List[Tuple[str, int]] = []
    for dir_path in root_dirs:
        results.extend(search_files(query, dir_path))
    return {"query": query, "results": results}
