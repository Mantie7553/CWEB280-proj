from sqlalchemy import  create_engine
from sqlalchemy.orm import Session, Query
from pydantic import BaseModel
from datetime import datetime

from app import config
from app.schemas.database_schema import Game, Team

engine = create_engine(config.DB_PATH, echo=True, future=True)


class GameData(BaseModel):
    dateTime: str
    homeTeam: str
    awayTeam: str
    homeScore: int
    awayScore: int


def query_games():
    with Session(engine) as session:
        return session.query(Game).all()


def add_game(data: GameData):
    with Session(engine) as session:
        homeTeam = session.query(Team)\
        .filter(data.homeTeam == Team.name)\
        .first()

        awayTeam = session.query(Team)\
            .filter(data.awayTeam == Team.name)\
            .first()
        if homeTeam is None or awayTeam is None:
            return {"error": "Home or away team not found"}

        if homeTeam is awayTeam:
            return {"error": "Home and away teams must be different"}

        gameDate = datetime.fromisoformat(data.dateTime).date()

        game = Game(
            gameDate = gameDate,
            homeTeam = homeTeam.id,
            awayTeam = awayTeam.id,
            homeScore = data.homeScore,
            awayScore = data.awayScore
        )

        session.add(game)
        session.commit()
        session.refresh(game)
        return {
            "id": game.id,
            "homeTeam": homeTeam.name,
            "awayTeam": awayTeam.name,
            "homeScore": game.homeScore,
            "awayScore": game.awayScore
        }