from fastapi import APIRouter

from app.services.games_service import add_game, GameData, query_games, paged_games
from app.services.teams_service import team_with_stats

router = APIRouter(prefix="/api/game", tags=["api"])

# API path for handling the creation of new games
@router.post("/add")
async def post_game(data: GameData):
    return add_game(data)


# TESTING PURPOSES -- to see what is in the database and how it is returned
@router.get("")
async def get_games():
    return query_games()

# returns a paged list of games based off of the path to the API, should be changed and have multiple ways to order
@router.get("/{page}")
async def get_game_page(page: int):
    return paged_games(page=page)

