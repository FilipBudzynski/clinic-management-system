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
    "http://localhost:3000",
    "http://localhost:8000",
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


app.mount("/static", StaticFiles(directory="static/static", html=True), name="static")

templates = Jinja2Templates(directory="static")

app.include_router(auth.router)
app.include_router(api.router)


@app.route("/{path:path}")
async def read_root(request: Request, path: str = None):
    return templates.TemplateResponse("index.html", {"request": request})


# class SPAStaticFiles(StaticFiles):
#     async def get_response(self, path: str, scope):
#         response = await super().get_response(path, scope)
#         if response.status_code == 404:
#             response = await super().get_response(".", scope)
#         return response


# app.mount("/", SPAStaticFiles(directory="static", html=True), name="static")
# templates = Jinja2Templates(directory="static")
#
#
# @app.get("/")
# async def serve_spa(request: Request):
#     return templates.TemplateResponse("index.html", {"request": request})
#
#
# @app.route("/{full_path:path}")
# async def catch_all(request: Request):
#     return templates.TemplateResponse("index.html", {"request": request})


#
# def ensure_user_group(
#     current_user: user_dependency, required_group: Groupe = Groupe.Admin
# ):
#     user_group = Groupe(current_user["groupe"])
#     if user_group != required_group.name:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="You do not have access to this resource",
#         )
#     return current_user
#
#
# @app.post(
#     "/users",
#     status_code=status.HTTP_201_CREATED,
#     response_model=schemas.User,
# )
# async def create_user(user: schemas.UserBase, db: db_dependency):
#     db_user = models.User(**user.model_dump())
#     db.add(db_user)
#     db.commit()
#     return db_user
#
#
# @app.get("/users/{user_id}", status_code=status.HTTP_200_OK)
# async def read_user(user_id: int, db: db_dependency):
#     user = db.query(models.User).filter(models.User.id == user_id).first()
#     if user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user
#
#
# @app.patch("/users/{user_id}", response_model=schemas.User)
# async def update_user(user_id: int, user: schemas.UserEdit, db: db_dependency):
#     db_user = db.get(models.User, user_id)
#     if not db_user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
#         )
#     user_data = user.model_dump(exclude_unset=True)
#     for key, value in user_data.items():
#         setattr(db_user, key, value)
#     db.commit()
#     db.refresh(db_user)
#     return db_user
#
#
# @app.get(
#     "/users",
#     status_code=status.HTTP_200_OK,
#     dependencies=[Depends(ensure_user_group)],
# )
# async def read_all_users(db: db_dependency, skip: int = 0, limit: int = 100):
#     users = db.query(models.User).offset(skip).limit(limit).all()
#     return users
#
#
# @app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_user(user_id: int, db: db_dependency):
#     # Check if the user exists
#     db_user = db.query(models.User).filter(models.User.id == user_id).first()
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     visits_to_update = (
#         db.query(models.Visit).filter(models.Visit.user_id == user_id).all()
#     )
#     print(visits_to_update)
#     for visit in visits_to_update:
#         visit.user_id = None
#         visit.is_reserved = False
#
#     try:
#         db.commit()
#         db.delete(db_user)
#         db.commit()
#         return None
#     except StaleDataError:
#         raise HTTPException(
#             status_code=409, detail="Data has changed. Please refresh and try again."
#         )
#
#     return None
#
#
# @app.get("/current_user", status_code=status.HTTP_200_OK)
# async def current_user(user: user_dependency, db: db_dependency):
#     if user is None:
#         raise HTTPException(status_code=401, detail="Authentication Failed")
#     if user["groupe"] == "Doctor":
#         db_user = db.query(models.Doctor).get(user["id"])
#     else:
#         db_user = db.query(models.User).get(user["id"])
#     return db_user
#
#
# @app.post(
#     "/doctors", status_code=status.HTTP_201_CREATED, response_model=schemas.Doctor
# )
# async def create_doctor(doctor: schemas.DoctorCreate, db: db_dependency):
#     db_doctor = models.Doctor(**doctor.model_dump())
#     db.add(db_doctor)
#     db.commit()
#     return db_doctor
#
#
# @app.patch("/doctors/{doctor_id}")
# async def update_doctor(doctor_id: int, doctor: schemas.DoctorEdit, db: db_dependency):
#     db_doctor = db.get(models.Doctor, doctor_id)
#     if not db_doctor:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
#         )
#     doctor_data = doctor.model_dump(exclude_unset=True)
#     for key, value in doctor_data.items():
#         setattr(db_doctor, key, value)
#     db.commit()
#     db.refresh(db_doctor)
#     return db_doctor
#
#
# @app.get("/doctors/{doctor_id}", status_code=status.HTTP_200_OK)
# async def read_doctor(doctor_id: int, db: db_dependency):
#     doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
#     if doctor is None:
#         raise HTTPException(status_code=404, detail="Doctor not found")
#     return doctor
#
#
# @app.get("/doctors", status_code=status.HTTP_200_OK)
# async def read_all_doctors(db: db_dependency, skip: int = 0, limit: int = 100):
#     doctors = db.query(models.Doctor).offset(skip).limit(limit).all()
#     return doctors
#
#
# def create_visits(schedule: schemas.ScheduleCreate):
#     start_datetime = datetime.combine(schedule.day, schedule.start)
#     finish_datetime = datetime.combine(schedule.day, schedule.finish)
#     current_datetime = start_datetime
#     visits = []
#     while current_datetime < finish_datetime:
#         visit = schemas.VisitCreate(
#             visit_date=current_datetime,
#             description=None,
#             user_id=None,
#             doctor_id=schedule.doctor_id,
#             is_reserved=False,
#         )
#         visits.append(visit)
#         current_datetime += timedelta(minutes=15)
#     return visits
#
#
# @app.post(
#     "/schedules",
#     status_code=status.HTTP_201_CREATED,
#     response_model=schemas.ScheduleBase,
# )
# async def schedule_create(schedule: schemas.ScheduleCreate, db: db_dependency):
#     db_schedule = models.Schedule(**schedule.model_dump())
#     db.add(db_schedule)
#     new_visits = create_visits(schedule)
#     for visit in new_visits:
#         db_visit = models.Visit(**visit.model_dump())
#         db.add(db_visit)
#     db.commit()
#     return db_schedule
#
#
# @app.get("/schedules/{schedule_id}", status_code=status.HTTP_200_OK)
# async def read_schedule(schedule_id: int, db: db_dependency):
#     schedule = (
#         db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
#     )
#     if schedule is None:
#         raise HTTPException(status_code=404, detail="Doctor not found")
#     return schedule
#
#
# @app.get("/schedules", status_code=status.HTTP_200_OK)
# async def read_all_schedules(db: db_dependency, skip: int = 0, limit: int = 100):
#     schedules = (
#         db.query(models.Schedule)
#         .offset(skip)
#         .limit(limit)
#         .options(joinedload(models.Schedule.doctor))
#         .all()
#     )
#     return schedules
#
#
# @app.post(
#     "/visits",
#     status_code=status.HTTP_201_CREATED,
#     response_model=schemas.VisitBase,
# )
# async def visit_create(schedule: schemas.VisitCreate, db: db_dependency):
#     db_visit = models.Visit(**schedule.model_dump())
#     db.add(db_visit)
#     db.commit()
#     return db_visit
#
#
# @app.put("/visits/{visit_id}", response_model=schemas.VisitBase)
# async def edit_visit(visit_id: int, user_id: int, db: db_dependency):
#     db_visit = db.query(models.Visit).filter(models.Visit.id == visit_id).first()
#     if db_visit is None:
#         raise HTTPException(status_code=404, detail="Visit not found")
#     db.query(models.Visit).filter(models.Visit.id == visit_id).update(
#         {"user_id": user_id, "is_reserved": True}
#     )
#     db.commit()
#     db.refresh(db_visit)
#     return db_visit
#
#
# @app.patch("/visits/{visit_id}", response_model=schemas.VisitBase)
# async def edit_visit_description(
#     visit_id: int, visit: schemas.VisitUpdate, db: db_dependency
# ):
#     db_visit = db.query(models.Visit).filter(models.Visit.id == visit_id).first()
#     if db_visit is None:
#         raise HTTPException(status_code=404, detail="Visit not found")
#     if db_visit.row_version != visit.row_version:
#         raise HTTPException(status_code=409, detail="Data has changed")
#
#     update_data = visit.model_dump(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(db_visit, key, value)
#
#     try:
#         db.commit()
#         db.refresh(db_visit)
#         return db_visit
#     except StaleDataError:
#         raise HTTPException(
#             status_code=409, detail="Data has changed. Please refresh and try again."
#         )
#
#
# @app.get("/visits", status_code=status.HTTP_200_OK)
# async def read_all_visits(db: db_dependency, skip: int = 0, limit: int = 100):
#     visits = (
#         db.query(models.Visit)
#         .offset(skip)
#         .limit(limit)
#         .options(joinedload(models.Visit.user), joinedload(models.Visit.doctor))
#         .all()
#     )
#     return visits
#
#
# @app.get("/specialities", status_code=status.HTTP_200_OK)
# async def get_specialitis():
#     specialties = [specialty for specialty in models.Speciality]
#     return specialties
