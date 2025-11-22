from datetime import date
from typing import List

from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app import config
from app.services.games_service import GameData
from app.schemas.database_schema import Series, SeriesGames, Game, Team

engine = create_engine(config.DB_PATH, echo=True, future=True)


class SeriesData(BaseModel):
    """A class used to represent a series data including the games it is connected to"""
    name: str
    type: str
    desc: str
    start: date
    end: date
    games: List[GameData]


def paged_series(page: int = 1, filter: str = None):
    """Get paginated series with their associated games"""
    with Session(engine) as session:
        offset = (page - 1) * 5

        # Build query with optional filter
        query = session.query(Series)

        # Apply filter if specified
        if filter == "featured":
            # For featured, get the 3 most recent series
            query = query.order_by(Series.startDate.desc()).limit(3)
        else:
            # Regular pagination
            query = query.order_by(Series.seriesId.desc()).offset(offset).limit(5)

        series_list = query.all()

        to_return = []
        for series in series_list:
            # Get games for this series
            series_games = session.query(SeriesGames).filter(
                SeriesGames.seriesId == series.seriesId
            ).all()

            game_ids = [sg.gameId for sg in series_games]
            games = []

            if game_ids:
                games_data = session.query(Game).filter(Game.id.in_(game_ids)).all()

                for game in games_data:
                    home_team = session.query(Team).filter(Team.id == game.homeTeam).first()
                    away_team = session.query(Team).filter(Team.id == game.awayTeam).first()

                    games.append({
                        "id": game.id,
                        "gameDate": str(game.gameDate),
                        "homeTeam": {
                            "id": home_team.id,
                            "name": home_team.name,
                            "logoFName": home_team.logoFName
                        },
                        "awayTeam": {
                            "id": away_team.id,
                            "name": away_team.name,
                            "logoFName": away_team.logoFName
                        },
                        "homeScore": game.homeScore,
                        "awayScore": game.awayScore
                    })

            to_return.append({
                "id": series.seriesId,
                "name": series.seriesName,
                "type": series.seriesType,
                "description": series.description,
                "start": str(series.startDate),
                "end": str(series.endDate),
                "games": games,
                "totalGames": len(games)
            })

        # Get total count for pagination
        total_series = session.query(Series).count()
        total_pages = (total_series + 4) // 5  # Round up division

        return {
            "series": to_return,
            "pageCount": total_pages,
            "totalSeries": total_series
        }


def get_series_by_id(series_id: int):
    """Get a single series with all its games"""
    with Session(engine) as session:
        series = session.query(Series).filter(Series.seriesId == series_id).first()

        if not series:
            return None

        # Get games for this series
        series_games = session.query(SeriesGames).filter(
            SeriesGames.seriesId == series_id
        ).all()

        game_ids = [sg.gameId for sg in series_games]
        games = []

        if game_ids:
            games_data = session.query(Game).filter(Game.id.in_(game_ids)).all()

            for game in games_data:
                home_team = session.query(Team).filter(Team.id == game.homeTeam).first()
                away_team = session.query(Team).filter(Team.id == game.awayTeam).first()

                games.append({
                    "id": game.id,
                    "gameDate": str(game.gameDate),
                    "homeTeam": {
                        "id": home_team.id,
                        "name": home_team.name,
                        "logoFName": home_team.logoFName
                    },
                    "awayTeam": {
                        "id": away_team.id,
                        "name": away_team.name,
                        "logoFName": away_team.logoFName
                    },
                    "homeScore": game.homeScore,
                    "awayScore": game.awayScore
                })

        return {
            "id": series.seriesId,
            "name": series.seriesName,
            "type": series.seriesType,
            "description": series.description,
            "start": str(series.startDate),
            "end": str(series.endDate),
            "games": games,
            "totalGames": len(games)
        }


def create_series(name: str, type: str, desc: str, start: date, end: date, game_ids: List[int] = None):
    """Create a new series and optionally add games to it"""
    with Session(engine) as session:
        # Create the series
        new_series = Series(
            seriesName=name,
            seriesType=type,
            description=desc,
            startDate=start,
            endDate=end
        )

        session.add(new_series)
        session.commit()
        session.refresh(new_series)

        series_id = new_series.seriesId

        # Add games if provided
        if game_ids:
            add_games_to_series(series_id, game_ids, session)

        return series_id


def update_series(series_id: int, name: str, type: str, desc: str, start: date, end: date):
    """Update an existing series"""
    with Session(engine) as session:
        series = session.query(Series).filter(Series.seriesId == series_id).first()

        if not series:
            return False

        # Update fields
        series.seriesName = name
        series.seriesType = type
        series.description = desc
        series.startDate = start
        series.endDate = end

        session.commit()
        return True


def delete_series(series_id: int):
    """Delete a series and all its game associations"""
    with Session(engine) as session:
        series = session.query(Series).filter(Series.seriesId == series_id).first()

        if not series:
            return False

        # Delete all associated SeriesGames entries (cascade should handle this, but being explicit)
        session.query(SeriesGames).filter(SeriesGames.seriesId == series_id).delete()

        # Delete the series
        session.delete(series)
        session.commit()

        return True


def add_games_to_series(series_id: int, game_ids: List[int], session: Session = None):
    """
    Add games to an existing series
    Does not allow for duplicate games
    """
    close_session = False
    if session is None:
        session = Session(engine)
        close_session = True

    try:
        # Check if series exists
        series = session.query(Series).filter(Series.seriesId == series_id).first()
        if not series:
            raise ValueError(f"Series with ID {series_id} not found")

        # Add each game to the series (avoid duplicates)
        for game_id in game_ids:
            # Check if game exists
            game = session.query(Game).filter(Game.id == game_id).first()
            if not game:
                raise ValueError(f"Game with ID {game_id} not found")

            # Check if already linked
            existing = session.query(SeriesGames).filter(
                SeriesGames.seriesId == series_id,
                SeriesGames.gameId == game_id
            ).first()

            if not existing:
                series_game = SeriesGames(seriesId=series_id, gameId=game_id)
                session.add(series_game)

        session.commit()
    finally:
        if close_session:
            session.close()


def remove_game_from_series(series_id: int, game_id: int):
    """Remove a game from a series"""
    with Session(engine) as session:
        series_game = session.query(SeriesGames).filter(
            SeriesGames.seriesId == series_id,
            SeriesGames.gameId == game_id
        ).first()

        if not series_game:
            return False

        session.delete(series_game)
        session.commit()

        return True