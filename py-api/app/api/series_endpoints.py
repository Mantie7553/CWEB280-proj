from typing import Optional, List

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from datetime import date

from app.services.series_service import paged_series, create_series, add_games_to_series, get_series_by_id


router = APIRouter(prefix="/api/series", tags=["api"])


class CreateSeriesRequest(BaseModel):
    name: str
    type: str
    desc: str
    start: date
    end: date
    games: List[int] = []


class AddGamesRequest(BaseModel):
    gameIds: List[int]


@router.get("/{page}")
async def get_series_page(page: int, filter: Optional[str] = Query(None)):
    return paged_series(page=page, filter=filter)


@router.get("/detail/{series_id}")
async def get_series_detail(series_id: int):
    series = get_series_by_id(series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    return series


@router.post("/")
async def create_new_series(request: CreateSeriesRequest):
    try:
        series_id = create_series(
            name=request.name,
            type=request.type,
            desc=request.desc,
            start=request.start,
            end=request.end,
            game_ids=request.games
        )
        return {"success": True, "seriesId": series_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{series_id}/games")
async def add_games(series_id: int, request: AddGamesRequest):
    try:
        add_games_to_series(series_id, request.gameIds)
        return {"success": True, "message": f"Added {len(request.gameIds)} games to series"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
