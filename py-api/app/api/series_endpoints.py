from typing import Optional, List

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from datetime import date

from app.services.series_service import (paged_series, create_series,
                                         add_games_to_series, get_series_by_id,
                                         delete_series, remove_game_from_series,
                                         update_series)

router = APIRouter(prefix="/api/series", tags=["api"])


class CreateSeriesRequest(BaseModel):
    name: str
    type: str
    desc: str
    start: date
    end: date
    games: List[int] = []


class UpdateSeriesRequest(BaseModel):
    name: str
    type: str
    desc: str
    start: date
    end: date


class AddGamesRequest(BaseModel):
    gameIds: List[int]


@router.get("/{page}")
async def get_series_page(page: int, filter: Optional[str] = Query(None)):
    """API endpoint for getting a paged list of series"""
    return paged_series(page=page, filter=filter)


@router.get("/detail/{series_id}")
async def get_series_detail(series_id: int):
    """API endpoint for getting a specific series details"""
    series = get_series_by_id(series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    return series


@router.post("/")
async def create_new_series(request: CreateSeriesRequest):
    """API endpoint for creating a new series"""
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


@router.put("/{series_id}")
async def update_existing_series(series_id: int, request: UpdateSeriesRequest):
    """API endpoint for updating an existing series"""
    try:
        updated = update_series(
            series_id=series_id,
            name=request.name,
            type=request.type,
            desc=request.desc,
            start=request.start,
            end=request.end
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Series not found")
        return {"success": True, "message": "Series updated successfully", "seriesId": series_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{series_id}")
async def delete_existing_series(series_id: int):
    """API endpoint for deleting an existing series and any connections to any games"""
    try:
        deleted = delete_series(series_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Series not found")
        return {"success": True, "message": "Series deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{series_id}/games")
async def add_games(series_id: int, request: AddGamesRequest):
    """API endpoint for adding games to a series"""
    try:
        add_games_to_series(series_id, request.gameIds)
        return {"success": True, "message": f"Added {len(request.gameIds)} games to series"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{series_id}/games/{game_id}")
async def remove_game(series_id: int, game_id: int):
    """API endpoint to Remove a game from a series"""
    try:
        removed = remove_game_from_series(series_id, game_id)
        if not removed:
            raise HTTPException(status_code=404, detail="Game not found in series")
        return {"success": True, "message": "Game removed from series"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))