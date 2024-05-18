from database import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Date,
    Time,
    Enum,
    ForeignKey,
    Text,
    Boolean,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum


class Groupe(PyEnum):
    Admin = "Admin"
    User = "User"
    Doctor = "Doctor"


class UserBase(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True, unique=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(50), nullable=True)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    password = Column(String(50), nullable=False)
    groupe = Column(Enum(Groupe))


class User(UserBase, Base):
    __tablename__ = "users"

    is_active = Column(Boolean, nullable=True)
    visits = relationship("Visit", back_populates="user")


class Speciality(PyEnum):
    Dermatolog = "Dermatolog"
    Cardiolog = "Cardiolog"
    Neurolog = "Neurolog"
    Orthopedic = "Orthopedic"
    Pediatric = "Pediatric"


class Doctor(UserBase, Base):
    __tablename__ = "doctors"

    visits = relationship("Visit", back_populates="doctor")
    schedules = relationship("Schedule", back_populates="doctor")
    speciality = Column(Enum(Speciality))


class Visit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True, index=True)
    visit_date = Column(DateTime)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="visits")
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    doctor = relationship("Doctor", back_populates="visits")
    is_reserved = Column(Boolean, default=False)
    row_version = Column(Integer, nullable=False)

    __mapper_args__ = {"version_id_col": row_version}


class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    doctor = relationship("Doctor", back_populates="schedules")
    day = Column(Date)
    start = Column(Time)
    finish = Column(Time)
