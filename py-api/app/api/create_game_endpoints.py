from fastapi import APIRouter

from app.services.games_service import add_game, GameData, query_games

router = APIRouter(prefix="/api/game", tags=["api"])

@router.post("/add")
async def post_game(data: GameData):
    return add_game(data)

@router.get("")
async def get_games():
    return query_games()