import math

from sqlalchemy import  create_engine
from sqlalchemy.orm import Session, aliased
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

def paged_games(page: int):
    with Session(engine) as session:
        offset = (page -1) * 5
        totalGames = session.query(Game).count()
        pageCount = math.ceil(totalGames / 5)

        if page < 1 or page > pageCount:
            return {
                "games": [],
                "totalGames": totalGames,
                "pageCount": pageCount,
                "page": page,
                "error": "Invalid page number"
            }

        homeTeam = aliased(Team)
        awayTeam = aliased(Team)


        games = session.query(
            Game,
            homeTeam.name,
            homeTeam.logoFName,
            awayTeam.name,
            awayTeam.logoFName,
        )\
            .join(homeTeam, Game.homeTeam == homeTeam.id)\
            .join(awayTeam, Game.awayTeam == awayTeam.id)\
            .offset(offset).limit(5).all()

    #Query returns something like the following
    #       (gameInfo1, homeTeam, homeTeamLogo, awayTeam, awayTeamLogo),
    #               (gameInfo2, homeTeam, awayTeam), ...
    # so we access them as:
    #  game[0] = gameInfo
    #  game[1] = homeTeamName
    #  game[2] = homeTeamLogo
    #  game[3] = awayTeamName
    #  game[4] = awayTeamLogo
        formattedGames = [
            {
                "id": game[0].id,
                "gameDate": game[0].gameDate.isoformat(),
                "homeTeam": {
                    "id": game[0].homeTeam,
                    "name": game[1],
                    "logoFName": game[2]
                },
                "awayTeam": {
                    "id": game[0].awayTeam,
                    "name": game[3],
                    "logoFName": game[4]
                },
                "homeScore": game[0].homeScore,
                "awayScore": game[0].awayScore
            }
            for game in games
        ]

        return {
            "games": formattedGames,
            "totalGames": totalGames,
            "pageCount": pageCount,
            "page": page
        }


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