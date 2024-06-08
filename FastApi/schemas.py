from enum import Enum
from datetime import datetime, date, time
from typing import List
from pydantic import BaseModel, EmailStr


class Speciality(str, Enum):
    Dermatolog = "Dermatologist"
    Cardiolog = "Cardiologist"
    Neurolog = "Neurologist"
    Orthopedic = "Orthopaedist"
    Pediatric = "Pediatrician"


class Groupe(str, Enum):
    Admin = "Admin"
    User = "User"
    Doctor = "Doctor"


class UserBase(BaseModel):
    username: str
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    password: str
    groupe: Groupe = Groupe.User
    is_active: bool | None = None


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserEdit(BaseModel):
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool | None = None


class DoctorBase(BaseModel):
    username: str
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    password: str
    groupe: Groupe = Groupe.Doctor
    speciality: Speciality


class DoctorEdit(BaseModel):
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    speciality: Speciality

    class Config:
        from_attributes = True
        exclude = {"visits"}


class DoctorCreate(DoctorBase):
    pass


class Doctor(DoctorBase):
    id: int
    visits: List["Visit"] = []
    schedules: List["Schedule"] = []

    class Config:
        from_attributes = True


class VisitBase(BaseModel):
    visit_date: datetime
    description: str | None = None
    user_id: int | None = None
    doctor_id: int | None = None
    is_reserved: bool = False


class VisitCreate(VisitBase):
    pass


class VisitUpdate(BaseModel):
    description: str
    row_version: int


class Visit(VisitBase):
    id: int
    row_version: int | None = None
    user: User | None = None
    doctor: Doctor | None = None

    class Config:
        from_attributes = True


class ScheduleBase(BaseModel):
    doctor_id: int
    day: date
    start: time
    finish: time


class ScheduleCreate(ScheduleBase):
    pass


class Schedule(ScheduleBase):
    id: int
    doctor: Doctor | None = None

    class Config:
        from_attributes = True
