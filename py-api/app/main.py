from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api import reset_endpoints, game_endpoints, team_endpoints
from app.api import series_endpoints, account_endpoints
from config import ALLOW_ORIGINS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reset_endpoints.router)
app.include_router(game_endpoints.router)
app.include_router(team_endpoints.router)
app.include_router(series_endpoints.router)
app.include_router(account_endpoints.router)

if __name__ == "__main__":
    print("Server is starting on \033[96m http://localhost:8080 \033[0m")
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)