from dotenv import load_dotenv
import os
load_dotenv() #loads values from .env file if it exists !IMPORTANT .env files should NEVER be put on git

#GLOBAL CONFIG VARIABLES - notice the all CAPS_SNAKE_CASE
DB_PATH = "sqlite:///./my.db"

# A list of allowed connections, add url to list if others are needed
ALLOW_ORIGINS = [
    "http://localhost:5173",
]