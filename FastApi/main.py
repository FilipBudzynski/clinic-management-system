from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
from datetime import datetime, timedelta
from fastapi.routing import APIRoute
from starlette.status import HTTP_200_OK
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
import schemas
from fastapi.middleware.cors import CORSMiddleware
import auth
from database import get_db
from schemas import Groupe
from sqlalchemy.orm.strategy_options import joinedload
from sqlalchemy.orm.exc import StaleDataError

# from fastapi.staticfiles import StaticFiles
from fastapi.routing import APIRouter
from starlette.routing import Router
import api
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request
from starlette.responses import RedirectResponse

from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from typing import Callable, Awaitable
from fastapi.responses import Response
from starlette.routing import Mount

app = FastAPI()


origins = [
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(auth.get_current_user)]

def init():
    db = next(get_db())
    models.prepopulate_db(db)
init()

app.mount("/static", StaticFiles(directory="static/static", html=True), name="static")

templates = Jinja2Templates(directory="static")

app.include_router(auth.router)
app.include_router(api.router)


@app.route("/{path:path}")
async def read_root(request: Request, path: str = None):
    return templates.TemplateResponse("index.html", {"request": request})
