from fastapi import APIRouter

from app.services.teams_service import TeamData, add_team, query_teams

router = APIRouter(prefix="/api/team", tags=["api"])

@router.post("/add")
async def post_team(data: TeamData):
    return add_team(data)

@router.get("")
async def get_teams():
    return query_teams()

