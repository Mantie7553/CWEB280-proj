import math

from sqlalchemy import create_engine, asc, desc
from sqlalchemy.orm import Session, aliased
from pydantic import BaseModel
from datetime import datetime, date

from app import config
from app.schemas.database_schema import Game, Team
from app.services.teams_service import team_win_loss, team_point_avg, team_diff_avg, last_score

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

def paged_games(page: int = 1, filter_type: str = None):
    with Session(engine) as session:
        offset = (page -1) * 5
        today = date.today()

        homeTeam = aliased(Team)
        awayTeam = aliased(Team)

        query = session.query(
            Game,
            homeTeam.name,
            homeTeam.logoFName,
            awayTeam.name,
            awayTeam.logoFName,
        )\
            .join(homeTeam, Game.homeTeam == homeTeam.id)\
            .join(awayTeam, Game.awayTeam == awayTeam.id)\

        if filter_type == "recent":
            query = query.filter(Game.gameDate < today).order_by(desc(Game.gameDate))
        elif filter_type == "upcoming":
            query = query.filter(Game.gameDate >= today).order_by(asc(Game.gameDate))
        else:
            query = query.order_by(desc(Game.gameDate))

        totalGames = query.count()
        pageCount = math.ceil(totalGames / 5) if totalGames > 0 else 1

        if page < 1 or page > pageCount:
            return {
                "games": [],
                "totalGames": totalGames,
                "pageCount": pageCount,
                "page": page,
                "error": "Invalid page number"
            }

        games = query.offset(offset).limit(5).all()

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


def paged_games_with_stats(page: int):
    with Session(engine) as session:
        offset = (page - 1) * 5

        homeTeam = aliased(Team)
        awayTeam = aliased(Team)

        query = session.query(
            Game,
            homeTeam.name,
            homeTeam.logoFName,
            awayTeam.name,
            awayTeam.logoFName,
        ) \
            .join(homeTeam, Game.homeTeam == homeTeam.id) \
            .join(awayTeam, Game.awayTeam == awayTeam.id)

        totalGames = query.count()
        pageCount = math.ceil(totalGames / 5) if totalGames > 0 else 1

        if page < 1 or page > pageCount:
            return {
                "games": [],
                "totalGames": totalGames,
                "pageCount": pageCount,
                "page": page,
                "error": "Invalid page number"
            }

        games = query.offset(offset).limit(5).all()



        formattedGames = []
        for game in games:
            homeWinRate = team_win_loss(homeTeam.name)
            homeAvgPoints = team_point_avg(homeTeam.name)
            homeAvgDiff = team_diff_avg(homeTeam.name)
            homeLastScore = last_score(homeTeam.name)

            awayWinRate = team_win_loss(awayTeam.name)
            awayAvgPoints = team_point_avg(awayTeam.name)
            awayAvgDiff = team_diff_avg(awayTeam.name)
            awayLastScore = last_score(awayTeam.name)

            formattedGames.append({
                "id": game[0].id,
                "gameDate": game[0].gameDate.isoformat(),
                "homeTeam": {
                    "id": game[0].homeTeam,
                    "name": game[1],
                    "logoFName": game[2],
                    "winRate": homeWinRate,
                    "avgPoints": homeAvgPoints,
                    "avgDiff": homeAvgDiff,
                    "lastScore": homeLastScore
                },
                "awayTeam": {
                    "id": game[0].awayTeam,
                    "name": game[3],
                    "logoFName": game[4],
                    "winRate": awayWinRate,
                    "avgPoints": awayAvgPoints,
                    "avgDiff": awayAvgDiff,
                    "lastScore": awayLastScore
                },
                "homeScore": game[0].homeScore,
                "awayScore": game[0].awayScore
            })

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