# this file can be used for any dummy data we may want

# create a bunch of "Objects" or instances of our models and then commit them to the database to be displayed
from datetime import date

from sqlalchemy import delete
from sqlalchemy.orm import Session
import random
from app.schemas.database_schema import Team, Game

def gen_teams(session: Session):
    raptors = Team(
        logoFName = "FileName.xyz",
        name = "Toronto Raptors"
    )

    warriors = Team(
        logoFName = "OtherFile.xyz",
        name = "Golden State Warriors"
    )

    pacers = Team(
        logoFName = "ThirdFile.xyz",
        name = "Indiana Pacers"
    )

    thunder = Team(
        logoFName = "LastFile.xyz",
        name = "Oklahoma City Thunder"
    )

    teamsToUse = [raptors, warriors, pacers, thunder]
    session.add_all(teamsToUse)
    session.commit()

def gen_games(session: Session):
    game1 = Game(
        gameDate = date.fromisocalendar(2025,30,2),
        homeTeam = 1,
        awayTeam = 2,
        homeScore = random.randint(70,150),
        awayScore = random.randint(70,150)
    )
    game2 = Game(
        gameDate = date.fromisocalendar(2025,44,5),
        homeTeam = 3,
        awayTeam = 4,
        homeScore = random.randint(70,150),
        awayScore = random.randint(70,150)
    )
    game3 = Game(
        gameDate = date.fromisocalendar(2025,44,6),
        homeTeam = 1,
        awayTeam = 4,
        homeScore = random.randint(70,150),
        awayScore = random.randint(70,150)
    )
    game4 = Game(
        gameDate = date.fromisocalendar(2025,50,0),
        homeTeam = 2,
        awayTeam = 3,
        homeScore = random.randint(70,150),
        awayScore = random.randint(70,150)
    )

    gamesToUse = [game1, game2, game3, game4]
    session.add_all(gamesToUse)
    session.commit()


def clear_db(session: Session):
    session.execute(delete(Team))
