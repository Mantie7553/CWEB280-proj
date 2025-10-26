# this file can be used for any dummy data we may want

# create a bunch of "Objects" or instances of our models and then commit them to the database to be displayed
from datetime import date

from sqlalchemy import delete
from sqlalchemy.orm import Session
import random
from app.schemas.database_schema import Team, Game

def gen_teams(session: Session):
    teamsToUse = []
    teamsToUse.append( Team(
        logoFName = "raptors.png",
        name = "Toronto Raptors"
    ))

    teamsToUse.append( Team(
        logoFName = "warriors.png",
        name = "Golden State Warriors"
    ))

    teamsToUse.append( Team(
        logoFName = "pacers.png",
        name = "Indiana Pacers"
    ))

    teamsToUse.append( Team(
        logoFName = "thunder.png",
        name = "Oklahoma City Thunder"
    ))

    teamsToUse.append( Team(
        logoFName="lakers.png",
        name="Los Angeles Lakers"
    ))

    teamsToUse.append( Team(
        logoFName="celtics.png",
        name="Boston Celtics"
    ))

    teamsToUse.append( Team(
        logoFName="heat.png",
        name="Miami Heat"
    ))

    teamsToUse.append( Team(
        logoFName="bulls.png",
        name="Chicago Bulls"
    ))

    teamsToUse.append( Team(
        logoFName="timberwolves.png",
        name="Minnesota Timberwolves"
    ))

    teamsToUse.append( Team(
        logoFName="hawks.png",
        name="Atlanta Hawks"
    ))

    session.add_all(teamsToUse)
    session.commit()

def gen_games(session: Session):
    gamesToUse = []

    gamesToUse.append(Game(
        gameDate=date(2024, 10, 22),
        homeTeam=1,  # Raptors
        awayTeam=2,  # Warriors
        homeScore=112,
        awayScore=118
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 10, 24),
        homeTeam=3,  # Pacers
        awayTeam=4,  # Thunder
        homeScore=105,
        awayScore=110
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 10, 26),
        homeTeam=5,  # Lakers
        awayTeam=6,  # Celtics
        homeScore=98,
        awayScore=102
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 10, 28),
        homeTeam=7,  # Heat
        awayTeam=8,  # Bulls
        homeScore=115,
        awayScore=108
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 11, 2),
        homeTeam=2,  # Warriors
        awayTeam=3,  # Pacers
        homeScore=122,
        awayScore=117
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 11, 5),
        homeTeam=4,  # Thunder
        awayTeam=5,  # Lakers
        homeScore=130,
        awayScore=125
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 11, 8),
        homeTeam=6,  # Celtics
        awayTeam=1,  # Raptors
        homeScore=118,
        awayScore=95
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 11, 10),
        homeTeam=8,  # Bulls
        awayTeam=7,  # Heat
        homeScore=101,
        awayScore=106
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 11, 15),
        homeTeam=1,  # Raptors
        awayTeam=4,  # Thunder
        homeScore=103,
        awayScore=111
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 11, 18),
        homeTeam=3,  # Pacers
        awayTeam=6,  # Celtics
        homeScore=114,
        awayScore=119
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 12, 1),
        homeTeam=5,  # Lakers
        awayTeam=2,  # Warriors
        homeScore=128,
        awayScore=121
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 12, 5),
        homeTeam=7,  # Heat
        awayTeam=3,  # Pacers
        homeScore=110,
        awayScore=107
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 12, 10),
        homeTeam=2,  # Warriors
        awayTeam=8,  # Bulls
        homeScore=116,
        awayScore=109
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 12, 15),
        homeTeam=4,  # Thunder
        awayTeam=1,  # Raptors
        homeScore=125,
        awayScore=98
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 12, 20),
        homeTeam=6,  # Celtics
        awayTeam=5,  # Lakers
        homeScore=132,
        awayScore=126
    ))

    gamesToUse.append(Game(
        gameDate=date(2024, 12, 25),  # Christmas game
        homeTeam=5,  # Lakers
        awayTeam=6,  # Celtics
        homeScore=115,
        awayScore=120
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 1, 3),
        homeTeam=8,  # Bulls
        awayTeam=4,  # Thunder
        homeScore=104,
        awayScore=112
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 1, 8),
        homeTeam=3,  # Pacers
        awayTeam=7,  # Heat
        homeScore=119,
        awayScore=115
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 1, 12),
        homeTeam=1,  # Raptors
        awayTeam=5,  # Lakers
        homeScore=100,
        awayScore=108
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 1, 18),
        homeTeam=2,  # Warriors
        awayTeam=6,  # Celtics
        homeScore=124,
        awayScore=118
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 10, 1),
        homeTeam=4,  # Thunder
        awayTeam=2,  # Warriors
        homeScore=127,
        awayScore=122
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 10, 5),
        homeTeam=6,  # Celtics
        awayTeam=7,  # Heat
        homeScore=113,
        awayScore=110
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 10, 10),
        homeTeam=1,  # Raptors
        awayTeam=8,  # Bulls
        homeScore=106,
        awayScore=99
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 10, 15),
        homeTeam=5,  # Lakers
        awayTeam=4,  # Thunder
        homeScore=119,
        awayScore=123
    ))

    gamesToUse.append(Game(
        gameDate=date(2025, 11, 20),
        homeTeam=3,  # Pacers
        awayTeam=2,  # Warriors
        homeScore=111,
        awayScore=116
    ))

    session.add_all(gamesToUse)
    session.commit()


def clear_db(session: Session):
    session.execute(delete(Game))
    session.execute(delete(Team))
