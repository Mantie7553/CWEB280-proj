import math

from pydantic import BaseModel
from sqlalchemy import create_engine, or_, and_
from sqlalchemy.orm import Session, Query

from app import config
from app.schemas.database_schema import Team, Game

engine = create_engine(config.DB_PATH, echo=True, future=True)

# query the teams table to get basic team information, can compare to a passed in team
def query_teams(teamName: str | None = None):
    with Session(engine) as session:
        query: Query = session.query(
            Team.id,
            Team.name,
            Team.logoFName
        ).order_by(Team.name.asc())
        if teamName:
            query = query.filter(Team.name.like(f"%{teamName}%"))

        # convert to dictionary
        results = query.all()
        return [
            {
                "id": row.id,
                "name": row.name,
                "logoFName": row.logoFName
            }
            for row in results
        ]

# pydantic model
class TeamData(BaseModel):
    teamName: str
    teamLogoFName: str | None = None

# adds a new team entry in the database if they do not already exist
def add_team(data: TeamData):
    with Session(engine) as session:
        if not query_teams(data.teamName):
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

# returns the total points a given team has scored as an int
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

# returns the total number of games a team has played as both the home or away team
def total_games(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return 0

        homeGames = session.query(Game).filter(Game.homeTeam == team.id).count()
        awayGames = session.query(Game).filter(Game.awayTeam == team.id).count()

        return homeGames + awayGames

# returns the total point difference for a given team
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

# returns the last game score for a given team
def last_score(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return 0
        recent = session.query(Game).filter(
            or_(
                Game.homeTeam == team.id,
                Game.awayTeam == team.id
            )
        ).order_by(Game.gameDate.desc()).first()

        if recent is None:
            return 0

        return recent.homeScore if recent.homeTeam == team.id else recent.awayScore

# calculates the point average for a given team based on games played
def team_point_avg(teamName: str):
    pointTotal = total_points(teamName)
    allGames = total_games(teamName)

    if allGames == 0:
        return 0

    avgPoints = round(pointTotal / allGames, 2)
    return avgPoints

# calculates a teams win rate by the number of games they had a better score than the opposite team
def team_win_loss(teamName: str):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.name == teamName).first()
        if team is None:
            return 0

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
            return 0

        winRate = round((homeWins + awayWins) / totalGames, 3)

        return winRate

# calculates an average point differential for a given team based on games played
def team_diff_avg(teamName: str):
    allDiff = total_diff(teamName)
    allGames = total_games(teamName)

    if allGames == 0:
        return 0

    return round(allDiff / allGames, 2)

# creates a list of the top 5 teams by win rate
def top_teams():
    allTeams = query_teams()
    teamStats = []
    for team in allTeams:
        winRate = team_win_loss(team["name"])

        if winRate == 0:
            continue

        teamStats.append({
            "id": team["id"],
            "name": team["name"],
            "logoFName": team["logoFName"],
            "winRate": winRate,
            "avgPoints": team_point_avg(team["name"]),
            "avgDiff": team_diff_avg(team["name"])
        })

    teamStats.sort(key=lambda t: t["winRate"], reverse=True)
    return {"teams": teamStats[:5]}

# creates a list of all teams with their respective stats
def team_with_stats():
    allTeams = query_teams()
    teamStats = []
    for team in allTeams:
        winRate = team_win_loss(team["name"])
        avgPoints = team_point_avg(team["name"])
        avgDiff = team_diff_avg(team["name"])
        lastScore = last_score(team["name"])
        teamStats.append({
            "id": team["id"],
            "name": team["name"],
            "logoFName": team["logoFName"],
            "winRate": winRate,
            "avgPoints": avgPoints,
            "avgDiff": avgDiff,
            "lastScore": lastScore,
        })
        teamStats.sort(key=lambda t: t["name"])
    return {"teams": teamStats}

# creates a list of all teams with their respective stats and allows for pagination
def team_with_stats_paged(page: int):
    with Session(engine) as session:
        offset = (page - 1) * 5
        totalTeams = len(query_teams())
        pageCount = math.ceil(totalTeams / 5)

        if page < 1 or page > pageCount:
            return {
                "teams": [],
                "totalTeams": totalTeams,
                "pageCount": pageCount,
                "page": page,
                "error": "Invalid page number"
            }

    allTeams = query_teams()
    teamStats = []
    for team in allTeams:
        winRate = team_win_loss(team["name"])
        avgPoints = team_point_avg(team["name"])
        avgDiff = team_diff_avg(team["name"])
        lastScore = last_score(team["name"])
        teamStats.append({
            "id": team["id"],
            "name": team["name"],
            "logoFName": team["logoFName"],
            "winRate": winRate,
            "avgPoints": avgPoints,
            "avgDiff": avgDiff,
            "lastScore": lastScore,
        })
        teamStats.sort(key=lambda t: t["name"])

        page_teams = teamStats[offset:offset + 5]

        while len(page_teams) < 5:
            page_teams.append(None)

    return {
        "teams": teamStats[offset:offset + 5],
        "totalTeams": totalTeams,
        "pageCount": pageCount,
        "page": page
    }


# update an existing team
def update_team(team_id: int, data: TeamData):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.id == team_id).first()

        if not team:
            return {"error": "Team not found"}

        # Check if new name conflicts with another team
        if data.teamName != team.name:
            existing = session.query(Team).filter(
                Team.name == data.teamName,
                Team.id != team_id
            ).first()

            if existing:
                return {"error": "Team with this name already exists"}

        # Store old logo filename for potential deletion
        old_logo = team.logoFName

        # Update team fields
        team.name = data.teamName

        # Only update logo if a new value is provided
        if data.teamLogoFName is not None:
            team.logoFName = data.teamLogoFName

        session.commit()
        session.refresh(team)

        return {
            "id": team.id,
            "name": team.name,
            "logoFName": team.logoFName,
            "oldLogoFName": old_logo,
            "message": "Team updated successfully"
        }


# delete a team
def delete_team(team_id: int):
    with Session(engine) as session:
        team = session.query(Team).filter(Team.id == team_id).first()

        if not team:
            return {"error": "Team not found"}

        # Check if team has any games
        game_count = session.query(Game).filter(
            or_(Game.homeTeam == team_id, Game.awayTeam == team_id)
        ).count()

        if game_count > 0:
            return {"error": f"Cannot delete team. Team has {game_count} associated games."}

        team_info = {
            "id": team.id,
            "name": team.name,
            "logoFName": team.logoFName,
            "message": "Team deleted successfully"
        }

        session.delete(team)
        session.commit()

        return team_info