from sqlalchemy import create_engine
from sqlalchemy.orm import Session, Query

from app import config
from app.schemas.database_schema import Team

engine = create_engine(config.DB_PATH, echo=True, future=True)

def query_teams(teamName: str | None = None):
    with Session(engine) as session:
        query: Query = session.query(
            Team.id,
            Team.name,
            Team.logoFName
        )
        if teamName:
            query = query.filter(Team.name.like(f"%{teamName}%"))
        return query.all()