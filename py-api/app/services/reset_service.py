from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app import config
from app.database_fixtures import gen_teams, clear_db, gen_games

engine = create_engine(config.DB_PATH, echo=True, future=True)

def reset_teams():
    with Session(engine) as session:
        clear_db(session)
        gen_teams(session)
        gen_games(session)