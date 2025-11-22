# Created 2025/10/20
# This file handles structuring the Team table for our database
import sqlalchemy as sa
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, create_engine, event

import app.config

Base = declarative_base()

# The constructor for the Team table in the database
class Team(Base):
    __tablename__ = "Team"
    id = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    logoFName = Column(sa.String(255), nullable=True)
    name = Column(sa.String(100), nullable=False)

# The constructor for the Game table in the database
class Game(Base):
    __tablename__ = "Game"
    id = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    gameDate = Column(sa.Date, nullable=False)
    homeTeam = Column(sa.Integer, sa.ForeignKey("Team.id"), index=True, nullable=False)
    awayTeam = Column(sa.Integer, sa.ForeignKey("Team.id"), index=True, nullable=False)
    homeScore = Column(sa.Integer, nullable=False)
    awayScore = Column(sa.Integer, nullable=False)


class SeriesGames(Base):
    """The constructor for the SeriesGames table that connects games to Series"""
    __tablename__ = "SeriesGames"
    seriesGameId = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    seriesId = Column(sa.Integer, sa.ForeignKey("Series.seriesId", ondelete="CASCADE"), index=True, nullable=False)
    gameId = Column(sa.Integer, sa.ForeignKey("Game.id", ondelete="CASCADE"), index=True, nullable=False)


class Series(Base):
    """The constructor for the Series table that stores information about a series"""
    __tablename__ = "Series"
    seriesId = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    seriesName = Column(sa.String(100), nullable=False)
    seriesType = Column(sa.String(100), nullable=False)
    description = Column(sa.String(255), nullable=False)
    startDate = Column(sa.Date, nullable=False)
    endDate = Column(sa.Date, nullable=False)


class User(Base):
    """The constructor for the User table that stores information about a user"""
    __tablename__ = "User"
    userId = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    email = Column(sa.String(255), unique=True, index=True, nullable=False)
    password = Column(sa.String(255), nullable=True)
    googleId = Column(sa.String(255), nullable=True)


engine = create_engine(app.config.DB_PATH, echo=True, future=True)

# ensures that SQLite will enforce the foreign keys to the Team table
@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON;")
    cursor.close()


Base.metadata.create_all(engine)