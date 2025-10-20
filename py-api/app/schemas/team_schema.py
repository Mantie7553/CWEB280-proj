# Created 2025/10/20
# This file handles structuring the Team table for our database
import sqlalchemy as sa
from sqlalchemy import Column
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine

import app.config

Base = declarative_base()

class Team(Base):
    __tablename__ = "Team"
    id = Column(sa.Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    logoFName = Column(sa.String(255), nullable=True)
    name = Column(sa.String(100), nullable=False)


engine = create_engine(app.config.DB_PATH, echo=True, future=True)

Base.metadata.create_all(engine)