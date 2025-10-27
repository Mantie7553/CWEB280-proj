from typing import Optional

from fastapi import APIRouter, Query

from app.services.games_service import add_game, GameData, paged_games, paged_games_with_stats

router = APIRouter(prefix="/api/game", tags=["api"])

# API path for handling the creation of new games
@router.post("/add")
async def post_game(data: GameData):
    return add_game(data)

# returns a paged list of games based off of the path to the API, passes in a filter for upcoming or recent
@router.get("/{page}")
async def get_game_page(page: int, filter: Optional[str] = Query(None)):
    return paged_games(page=page, filter_type = filter)

#returns a paged list of games including a teams stats based off the path of the API
@router.get("/stats/{page}")
async def get_game_stats(page: int):
    return paged_games_with_stats(page=page)

