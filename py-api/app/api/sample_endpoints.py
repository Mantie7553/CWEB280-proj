from fastapi import APIRouter

from app.services.teams_service import query_teams
from app.services.reset_service import reset_teams
router = APIRouter(prefix="/api", tags=["api"])

@router.get("/teams")
async def send_teams():
    results = query_teams()
    toSend = [
        {
            "id": r[0],
            "name": r[1],
            "logo": r[2]
        }
        for r in results
    ]
    return toSend

@router.get("/load")
async def load_teams():
    reset_teams()