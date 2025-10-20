from fastapi import FastAPI
from config import ALLOW_ORIGINS
import uvicorn
from starlette.middleware.cors import CORSMiddleware

# this file is the API server and allows for the connection to our front end.
# Might not even need the app.get here and it should still work if that was moved to another file

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Connected to API successfully"}

if __name__ == "__main__":
    print("Server is starting on \033[96m http://localhost:8080 \033[0m")
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)