
from dotenv import load_dotenv
load_dotenv() #loads values from .env file if it exists !IMPORTANT .env files should NEVER be put on git

#GLOBAL CONFIG VARIABLES

DB_PATH = "sqlite:///./my.db"

# A list of allowed connections, add url to list if others are needed
ALLOW_ORIGINS = [
    "http://localhost:5173",
        "http://localhost:5174",  # Backup port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174", # Backup port
]

GOOGLE_CLIENT_ID = "63922091158-ilin5g6q540ms6j8qcbs614qhcgq77jc.apps.googleusercontent.com"