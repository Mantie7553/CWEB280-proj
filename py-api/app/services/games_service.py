import math

from sqlalchemy import create_engine, asc, desc
from sqlalchemy.orm import Session, aliased
from pydantic import BaseModel
from datetime import datetime, date

from app import config
from app.schemas.database_schema import Game, Team
from app.services.teams_service import team_win_loss, team_point_avg, team_diff_avg, last_score

engine = create_engine(config.DB_PATH, echo=True, future=True)

# pydantic model
class GameData(BaseModel):
    dateTime: str
    homeTeam: int
    awayTeam: int
    homeScore: int
    awayScore: int

# get all the games in the database
def query_games():
    with Session(engine) as session:
        return session.query(Game).all()

# get a paged list of games from the database, with an optional filter for upcoming or recent games
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

# return a paged list of games with all associated stats for each team
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
            homeName = game[1]
            awayName = game[3]
            homeWinRate = team_win_loss(homeName)
            homeAvgPoints = team_point_avg(homeName)
            homeAvgDiff = team_diff_avg(homeName)
            homeLastScore = last_score(homeName)

            awayWinRate = team_win_loss(awayName)
            awayAvgPoints = team_point_avg(awayName)
            awayAvgDiff = team_diff_avg(awayName)
            awayLastScore = last_score(awayName)

            formattedGames.append({
                "id": game[0].id,
                "gameDate": game[0].gameDate.isoformat(),
                "homeTeam": {
                    "id": game[0].homeTeam,
                    "name": homeName,
                    "logoFName": game[2],
                    "winRate": homeWinRate,
                    "avgPoints": homeAvgPoints,
                    "avgDiff": homeAvgDiff,
                    "lastScore": homeLastScore
                },
                "awayTeam": {
                    "id": game[0].awayTeam,
                    "name": awayName,
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

# submit a new game to the database
def add_game(data: GameData):
    with Session(engine) as session:
        homeTeam = session.query(Team)\
        .filter(data.homeTeam == Team.id)\
        .first()

        awayTeam = session.query(Team)\
            .filter(data.awayTeam == Team.id)\
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