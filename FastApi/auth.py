import dotenv
from fastapi.routing import APIRouter
from fastapi.security import (
    OAuth2PasswordRequestForm,
    OAuth2PasswordBearer,
)
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from sqlalchemy.sql.operators import from_
import models
from datetime import datetime, timedelta
import schemas
from database import get_db
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")
db_dependency = Annotated[Session, Depends(get_db)]


def create_access_token(
    username: str, user_id: int, groupe: str, expires_delta: timedelta
):
    encode = {"sub": username, "id": user_id, "groupe": groupe}
    expires = datetime.utcnow() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        groupe: str = payload.get("groupe")
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user.",
            )
        return {"username": username, "id": user_id, "groupe": groupe}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user."
        )


# @router.post("/token/")
# async def login_for_access_token(
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(db_dependency),
# ):
#     user = (
#         db.query(models.User).filter(models.User.username == form_data.username).first()
#     )
#
#     doctor = (
#         db.query(models.Doctor)
#         .filter(models.Doctor.username == form_data.username)
#         .first()
#     )
#
#     if not user and not doctor:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#
#     if user and not form_data.password == user.password:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#
#     if doctor and not form_data.password == doctor.password:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#
#     if user:
#         user_scheme = schemas.User.model_validate(user)
#         print("sraka")
#     elif doctor:
#         user_scheme = schemas.Doctor.model_validate(doctor)
#     else:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#
#     token = create_access_token(
#         user_scheme.username, user_scheme.id, timedelta(minutes=20)
#     )
#     return {"access_token": token, "token_type": "bearer"}
#


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):
    user = (
        db.query(models.User).filter(models.User.username == form_data.username).first()
    )

    if not user:
        user = (
            db.query(models.Doctor)
            .filter(models.Doctor.username == form_data.username)
            .first()
        )

    # user_scheme = schemas.User.model_validate(user)
    # print(user_scheme)

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not form_data.password == user.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    print(str(user.username))
    print(str(user.id))

    token = create_access_token(
        str(user.username), int(user.id), str(user.groupe.name), timedelta(minutes=20)
    )
    return {"access_token": token, "token_type": "bearer"}
