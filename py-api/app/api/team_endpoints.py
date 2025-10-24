from fastapi import APIRouter

from app.services.teams_service import TeamData, add_team, query_teams, top_teams, team_with_stats, \
    team_with_stats_paged

router = APIRouter(prefix="/api/team", tags=["api"])

# API path for handling the creation of new teams
@router.post("/add")
async def post_team(data: TeamData):
    return add_team(data)

# TESTING PURPOSES -- to see what is in the database and how it is returned
@router.get("")
async def get_teams():
    return query_teams()

# returns a list of the top 5 teams based on win rate, sorted by win rate
@router.get("/top")
async def get_top():
    return top_teams()

# returns a list of all teams with all "advanced" stats, sorted by team name
@router.get("/stats")
async def get_stats():
    return team_with_stats()

# returns a paged list of teams based off of the path to the API, should be changed
@router.get("/stats/{page}")
async def get_stats_page(page: int):
    return team_with_stats_paged(page=page)