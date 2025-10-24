from sqlalchemy import create_engine, or_, and_
from sqlalchemy.orm import Session, Query

from app import config
from app.schemas.database_schema import Team, Game

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


class TeamData:
    teamName: str
    teamLogoFName: str

def add_team(data: TeamData):
    with Session(engine) as session:
        if query_teams(data.teamName):
            team = Team(
                name=data.teamName,
                logoFName=data.teamLogoFName
            )
            session.add(team)
            session.commit()
            session.refresh(team)

            return {
                "id": team.id,
                "name": team.name,
                "logoFName": team.logoFName
            }
        return {"error": "Team already exists"}


def total_points(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return 0

        homeGames = session.query(Game).filter(Game.homeTeam == team.id).all()
        awayGames = session.query(Game).filter(Game.awayTeam == team.id).all()

        totalPoints = 0

        for game in homeGames:
            totalPoints += game.homeScore
        for game in awayGames:
            totalPoints += game.awayScore

        return totalPoints


def total_games(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return 0

        homeGames = session.query(Game).filter(Game.homeTeam == team.id).count()
        awayGames = session.query(Game).filter(Game.awayTeam == team.id).count()

        return homeGames + awayGames


def total_diff(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return 0
        allGames = session.query(Game).filter(or_(
            Game.homeTeam == team.id,
            Game.awayTeam == team.id)
        ).all()
        allPoints = total_points(team.name)
        opponentPoints = 0

        for game in allGames:
            if game.homeTeam == team.id:
                opponentPoints += game.awayScore
            else:
                opponentPoints += game.homeScore

        return allPoints - opponentPoints




def team_point_avg(teamName: str):
    with Session(engine) as session:
        pointTotal = total_points(teamName)
        allGames = total_games(teamName)

        if allGames == 0:
            return {"avgPoints": 0}

        avgPoints = round(pointTotal / allGames, 2)
        return {"avgPoints": avgPoints}


def team_win_loss(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return {"error": "Team not found"}

        homeWins= session.query(Game).filter(and_(
            Game.homeTeam == team.id,
            Game.homeScore > Game.awayScore
            )
        ).count()
        awayWins = session.query(Game).filter(and_(
            Game.awayTeam == team.id,
            Game.awayScore > Game.homeScore
            )
        ).count()

        totalGames = total_games(teamName)

        if totalGames == 0:
            return {"winRate": 0}

        winRate = round((homeWins + awayWins) / totalGames, 3)

        return {"winRate": winRate}


def team_diff_avg(teamName: str):
    with Session(engine) as session:
        allDiff = total_diff(teamName)
        allGames = total_games(teamName)

        if allGames == 0:
            return {"avgDiff": 0}

        return {"avgDiff": round(allDiff / allGames, 2)}

