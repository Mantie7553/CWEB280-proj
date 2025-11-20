# this file can be used for any dummy data we may want

# create a bunch of "Objects" or instances of our models and then commit them to the database to be displayed
from datetime import date

from sqlalchemy import delete
from sqlalchemy.orm import Session
import random
from app.schemas.database_schema import Team, Game, Series, SeriesGames, User


def gen_teams(session: Session):
    teamsToUse = [Team(
        name="Toronto Raptors"
    ), Team(
        name="Golden State Warriors"
    ), Team(
        name="Indiana Pacers"
    ), Team(
        name="Oklahoma City Thunder"
    ), Team(
        name="Los Angeles Lakers"
    ), Team(
        name="Boston Celtics"
    ), Team(
        name="Miami Heat"
    ), Team(
        name="Chicago Bulls"
    ), Team(
        name="Minnesota Timberwolves"
    ), Team(
        logoFName="atlanta-hawks.png",
        name="Atlanta Hawks"
    )]

    session.add_all(teamsToUse)
    session.commit()


def gen_games(session: Session):
    gamesToUse = [Game(
        gameDate=date(2024, 10, 22),
        homeTeam=1,  # Raptors
        awayTeam=2,  # Warriors
        homeScore=112,
        awayScore=118
    ), Game(
        gameDate=date(2024, 10, 24),
        homeTeam=3,  # Pacers
        awayTeam=4,  # Thunder
        homeScore=105,
        awayScore=110
    ), Game(
        gameDate=date(2024, 10, 26),
        homeTeam=5,  # Lakers
        awayTeam=6,  # Celtics
        homeScore=98,
        awayScore=102
    ), Game(
        gameDate=date(2024, 10, 28),
        homeTeam=7,  # Heat
        awayTeam=8,  # Bulls
        homeScore=115,
        awayScore=108
    ), Game(
        gameDate=date(2024, 11, 2),
        homeTeam=2,  # Warriors
        awayTeam=3,  # Pacers
        homeScore=122,
        awayScore=117
    ), Game(
        gameDate=date(2024, 11, 5),
        homeTeam=4,  # Thunder
        awayTeam=5,  # Lakers
        homeScore=130,
        awayScore=125
    ), Game(
        gameDate=date(2024, 11, 8),
        homeTeam=6,  # Celtics
        awayTeam=1,  # Raptors
        homeScore=118,
        awayScore=95
    ), Game(
        gameDate=date(2024, 11, 10),
        homeTeam=8,  # Bulls
        awayTeam=7,  # Heat
        homeScore=101,
        awayScore=106
    ), Game(
        gameDate=date(2024, 11, 15),
        homeTeam=1,  # Raptors
        awayTeam=4,  # Thunder
        homeScore=103,
        awayScore=111
    ), Game(
        gameDate=date(2024, 11, 18),
        homeTeam=3,  # Pacers
        awayTeam=6,  # Celtics
        homeScore=114,
        awayScore=119
    ), Game(
        gameDate=date(2024, 12, 1),
        homeTeam=5,  # Lakers
        awayTeam=2,  # Warriors
        homeScore=128,
        awayScore=121
    ), Game(
        gameDate=date(2024, 12, 5),
        homeTeam=7,  # Heat
        awayTeam=3,  # Pacers
        homeScore=110,
        awayScore=107
    ), Game(
        gameDate=date(2024, 12, 10),
        homeTeam=2,  # Warriors
        awayTeam=8,  # Bulls
        homeScore=116,
        awayScore=109
    ), Game(
        gameDate=date(2024, 12, 15),
        homeTeam=4,  # Thunder
        awayTeam=1,  # Raptors
        homeScore=125,
        awayScore=98
    ), Game(
        gameDate=date(2024, 12, 20),
        homeTeam=6,  # Celtics
        awayTeam=5,  # Lakers
        homeScore=132,
        awayScore=126
    ), Game(
        gameDate=date(2024, 12, 25),  # Christmas game
        homeTeam=5,  # Lakers
        awayTeam=6,  # Celtics
        homeScore=115,
        awayScore=120
    ), Game(
        gameDate=date(2025, 1, 3),
        homeTeam=8,  # Bulls
        awayTeam=4,  # Thunder
        homeScore=104,
        awayScore=112
    ), Game(
        gameDate=date(2025, 1, 8),
        homeTeam=3,  # Pacers
        awayTeam=7,  # Heat
        homeScore=119,
        awayScore=115
    ), Game(
        gameDate=date(2025, 1, 12),
        homeTeam=1,  # Raptors
        awayTeam=5,  # Lakers
        homeScore=100,
        awayScore=108
    ), Game(
        gameDate=date(2025, 1, 18),
        homeTeam=2,  # Warriors
        awayTeam=6,  # Celtics
        homeScore=124,
        awayScore=118
    ), Game(
        gameDate=date(2025, 10, 1),
        homeTeam=4,  # Thunder
        awayTeam=2,  # Warriors
        homeScore=127,
        awayScore=122
    ), Game(
        gameDate=date(2025, 10, 5),
        homeTeam=6,  # Celtics
        awayTeam=7,  # Heat
        homeScore=113,
        awayScore=110
    ), Game(
        gameDate=date(2025, 10, 10),
        homeTeam=1,  # Raptors
        awayTeam=8,  # Bulls
        homeScore=106,
        awayScore=99
    ), Game(
        gameDate=date(2025, 10, 15),
        homeTeam=5,  # Lakers
        awayTeam=4,  # Thunder
        homeScore=119,
        awayScore=123
    ), Game(
        gameDate=date(2025, 11, 20),
        homeTeam=3,  # Pacers
        awayTeam=2,  # Warriors
        homeScore=111,
        awayScore=116
    )]

    session.add_all(gamesToUse)
    session.commit()


def gen_series(session: Session):
    """Generate dummy series data with various types and game associations"""
    seriesToUse = [Series(
        seriesName="Lakers vs Celtics Holiday Showdown",
        seriesType="Rivalry",
        description="Historic rivalry matchups featuring Lakers and Celtics during the holiday season",
        startDate=date(2024, 12, 20),
        endDate=date(2024, 12, 25),
    ), Series(
        seriesName="2024 Season Opener Week",
        seriesType="Regular Season",
        description="First week of the 2024-25 NBA season featuring exciting matchups",
        startDate=date(2024, 10, 22),
        endDate=date(2024, 10, 28),
    ), Series(
        seriesName="Thunder Rising Championship Run",
        seriesType="Playoff Series",
        description="Oklahoma City Thunder's impressive playoff run showcasing their young talent",
        startDate=date(2024, 11, 5),
        endDate=date(2024, 12, 15),
    ), Series(
        seriesName="Eastern Conference Elite Series",
        seriesType="Conference",
        description="Top Eastern Conference teams battle for supremacy",
        startDate=date(2024, 10, 26),
        endDate=date(2024, 11, 18),
    ), Series(
        seriesName="Heat-Bulls Division Rivalry",
        seriesType="Division",
        description="Miami Heat and Chicago Bulls compete for Central Division bragging rights",
        startDate=date(2024, 10, 28),
        endDate=date(2025, 1, 8),
    ), Series(
        seriesName="Warriors Late Season Push",
        seriesType="Regular Season",
        description="Golden State Warriors fighting for playoff positioning",
        startDate=date(2024, 10, 22),
        endDate=date(2025, 1, 18),
    ), Series(
        seriesName="New Year's Basketball Showcase",
        seriesType="Special Event",
        description="Marquee matchups to ring in the new year",
        startDate=date(2025, 1, 3),
        endDate=date(2025, 1, 18),
    ), Series(
        seriesName="Fall Classic 2025",
        seriesType="Regular Season",
        description="Early season games featuring top contenders for the 2025-26 season",
        startDate=date(2025, 10, 1),
        endDate=date(2025, 10, 15),
    )]

    # Series 1: Lakers vs Celtics Rivalry - Christmas Series

    # Series 2: October Opening Week

    # Series 3: Thunder Rising - Thunder focused games

    # Series 4: Eastern Conference Showdown

    # Series 5: Heat vs Bulls Central Division Battle

    # Series 6: Warriors Dynasty Games

    # Series 7: New Year's Showcase

    # Series 8: Fall Classic 2025

    session.add_all(seriesToUse)
    session.commit()


def link_series_games(session: Session):
    """Link games to series through the SeriesGames junction table"""
    seriesGamesToUse = [SeriesGames(seriesId=1, gameId=15), SeriesGames(seriesId=1, gameId=16),
                        SeriesGames(seriesId=2, gameId=1), SeriesGames(seriesId=2, gameId=2),
                        SeriesGames(seriesId=2, gameId=3), SeriesGames(seriesId=2, gameId=4),
                        SeriesGames(seriesId=3, gameId=2), SeriesGames(seriesId=3, gameId=6),
                        SeriesGames(seriesId=3, gameId=9), SeriesGames(seriesId=3, gameId=14),
                        SeriesGames(seriesId=3, gameId=17), SeriesGames(seriesId=4, gameId=3),
                        SeriesGames(seriesId=4, gameId=7), SeriesGames(seriesId=4, gameId=10),
                        SeriesGames(seriesId=5, gameId=4), SeriesGames(seriesId=5, gameId=8),
                        SeriesGames(seriesId=5, gameId=12), SeriesGames(seriesId=5, gameId=17),
                        SeriesGames(seriesId=5, gameId=18), SeriesGames(seriesId=6, gameId=1),
                        SeriesGames(seriesId=6, gameId=5), SeriesGames(seriesId=6, gameId=11),
                        SeriesGames(seriesId=6, gameId=13), SeriesGames(seriesId=6, gameId=20),
                        SeriesGames(seriesId=7, gameId=17), SeriesGames(seriesId=7, gameId=18),
                        SeriesGames(seriesId=7, gameId=19), SeriesGames(seriesId=7, gameId=20),
                        SeriesGames(seriesId=8, gameId=21), SeriesGames(seriesId=8, gameId=22),
                        SeriesGames(seriesId=8, gameId=23), SeriesGames(seriesId=8, gameId=24)]

    # Series 1: Lakers vs Celtics Holiday Showdown (games 15, 16)

    # Series 2: 2024 Season Opener Week (games 1-4)

    # Series 3: Thunder Rising Championship Run (games 2, 6, 9, 14, 17)

    # Series 4: Eastern Conference Elite Series (games 3, 7, 10)

    # Series 5: Heat-Bulls Division Rivalry (games 4, 8, 12, 17, 18)

    # Series 6: Warriors Late Season Push (games 1, 5, 11, 13, 20)

    # Series 7: New Year's Basketball Showcase (games 17, 18, 19, 20)

    # Series 8: Fall Classic 2025 (games 21, 22, 23, 24)

    session.add_all(seriesGamesToUse)
    session.commit()


def gen_base_users(session: Session):
    users = [User(
        email="test@t.ca",
        password="123456Pw"
    ), User(
        email="jaden@mantie.ca",
        password="Password123"
    ), User(
        email="griffin@kinley.ca",
        password="Pa55w.rd"
    )]

    session.add_all(users)
    session.commit()


def clear_db(session: Session):
    session.execute(delete(SeriesGames))
    session.execute(delete(Series))
    session.execute(delete(Game))
    session.execute(delete(Team))
    session.execute(delete(User))
    session.commit()
