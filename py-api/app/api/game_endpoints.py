from fastapi import APIRouter

from app.services.games_service import add_game, GameData, query_games, paged_games

router = APIRouter(prefix="/api/game", tags=["api"])


@router.post("/add")
async def post_game(data: GameData):
    return add_game(data)


# TESTING PURPOSES -- to see what is in the database and how it is returned
@router.get("")
async def get_games():
    return query_games()


@router.get("/{page}")
async def get_game_page(page: int):
    return paged_games(page=page)