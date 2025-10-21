# Created 2025/10/20
# This file handles structuring the Team table for our database
import sqlalchemy as sa
from sqlalchemy import Column
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine, event

import app.config

Base = declarative_base()

class Team(Base):
    __tablename__ = "Team"
    id = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    logoFName = Column(sa.String(255), nullable=True)
    name = Column(sa.String(100), nullable=False)

class Game(Base):
    __tablename__ = "Game"
    id = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    gameDate = Column(sa.Date, nullable=False)
    homeTeam = Column(sa.Integer, sa.ForeignKey("Team.id"), index=True, nullable=False)
    awayTeam = Column(sa.Integer, sa.ForeignKey("Team.id"), index=True, nullable=False)
    homeScore = Column(sa.Integer, nullable=False)
    awayScore = Column(sa.Integer, nullable=False)


engine = create_engine(app.config.DB_PATH, echo=True, future=True)

# ensures that SQLite will enforce the foreign keys to the Team table
@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON;")
    cursor.close()


Base.metadata.create_all(engine)