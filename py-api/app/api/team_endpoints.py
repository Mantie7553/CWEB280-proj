from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import shutil
from pathlib import Path
import uuid

from app.services.teams_service import TeamData, add_team, query_teams, top_teams, team_with_stats, \
    team_with_stats_paged, update_team, delete_team

router = APIRouter(prefix="/api/team", tags=["api"])

UPLOAD_DIR = Path("../../react-web/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# API path for handling the creation of new teams
@router.post("/add")
async def post_team(
        teamName: str = Form(...),
        logoFile: UploadFile = File(None)
):
    try:
        logo_filename = ""

        if logoFile and logoFile.filename:
            allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"}
            file_ext = Path(logoFile.filename).suffix.lower()

            if file_ext not in allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
                )

            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = UPLOAD_DIR / unique_filename

            with file_path.open("wb") as buffer:
                shutil.copyfileobj(logoFile.file, buffer)

            logo_filename = unique_filename

        team_data = TeamData(
            teamName=teamName,
            teamLogoFName=logo_filename
        )

        result = add_team(team_data)

        if "error" in result:
            if logo_filename:
                (UPLOAD_DIR / logo_filename).unlink(missing_ok=True)
            return JSONResponse(status_code=400, content=result)

        return result

    except Exception as e:
        if 'logo_filename' in locals() and logo_filename:
            (UPLOAD_DIR / logo_filename).unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(e))


# API path for updating an existing team
@router.put("/update/{team_id}")
async def put_team(
        team_id: int,
        teamName: str = Form(...),
        logoFile: UploadFile = File(None),
        keepExistingLogo: bool = Form(True)
):
    try:
        logo_filename = None

        # If a new logo file is uploaded, process it
        if logoFile and logoFile.filename:
            allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"}
            file_ext = Path(logoFile.filename).suffix.lower()

            if file_ext not in allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
                )

            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = UPLOAD_DIR / unique_filename

            with file_path.open("wb") as buffer:
                shutil.copyfileobj(logoFile.file, buffer)

            logo_filename = unique_filename
        elif not keepExistingLogo:
            # User wants to remove the logo
            logo_filename = ""

        team_data = TeamData(
            teamName=teamName,
            teamLogoFName=logo_filename
        )

        result = update_team(team_id, team_data)

        if "error" in result:
            if logo_filename:
                (UPLOAD_DIR / logo_filename).unlink(missing_ok=True)
            return JSONResponse(status_code=400, content=result)

        return result

    except Exception as e:
        if 'logo_filename' in locals() and logo_filename:
            (UPLOAD_DIR / logo_filename).unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(e))

# API path for deleting a team
@router.delete("/delete/{team_id}")
async def remove_team(team_id: int):
    result = delete_team(team_id)
    # If deletion was successful and had a logo, try to delete the logo file
    if "logoFName" in result and result["logoFName"]:
        logo_path = UPLOAD_DIR / result["logoFName"]
        logo_path.unlink(missing_ok=True)

    return result

# Used to get a list of all teams currenty in the database
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