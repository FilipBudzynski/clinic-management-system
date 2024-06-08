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
)
from sqlalchemy.orm import relationship, Session
from enum import Enum as PyEnum
from datetime import date, time, datetime


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
    Dermatolog = "Dermatologist"
    Cardiolog = "Cardiologist"
    Neurolog = "Neurologist"
    Orthopedic = "Orthopaedist"
    Pediatric = "Pediatrician"


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


def prepopulate_db(db: Session):
    """
    Function for mocking - prepopulating the database
    """

    # Prepopulate users
    user_count = db.query(User).count()
    if user_count == 0:
        users = [
            User(
                is_active=True,
                id=1,
                username="admin",
                email="admin@example.com",
                first_name="Admin",
                last_name="Example",
                password="admin",
                groupe=Groupe.Admin,
            ),
            User(
                is_active=True,
                id=3,
                username="jhon",
                email="jhon@example.com",
                first_name="Jhon",
                last_name="Padincton",
                password="jhon",
                groupe=Groupe.User,
            ),
            User(
                is_active=True,
                id=4,
                username="amy",
                email="amy@example.com",
                first_name="Amy",
                last_name="Smith",
                password="amy123",
                groupe=Groupe.User,
            ),
            User(
                is_active=True,
                id=5,
                username="brian",
                email="brian@example.com",
                first_name="Brian",
                last_name="Johnson",
                password="brian123",
                groupe=Groupe.User,
            ),
            User(
                is_active=True,
                id=16,
                username="adam",
                email="adam@example.com",
                first_name="Adam",
                last_name="Brown",
                password="adam123",
                groupe=Groupe.User,
            ),
            User(
                is_active=True,
                id=17,
                username="kamil",
                email="kamil@example.com",
                first_name="Kamil",
                last_name="Slimak",
                password="kamil123",
                groupe=Groupe.User,
            ),
            User(
                is_active=False,
                id=18,
                username="ania",
                email="ania@gmail.com",
                first_name="Ania",
                last_name="Frania",
                password="ania123",
                groupe=Groupe.User,
            ),
        ]

        # Prepopulate schedules
        schedules = [
            Schedule(
                id=1,
                doctor_id=3,
                day=date(2024, 1, 17),
                start=time(11, 9, 0),
                finish=time(12, 9, 0),
            ),
            Schedule(
                id=2,
                doctor_id=2,
                day=date(2024, 1, 19),
                start=time(10, 8, 0),
                finish=time(11, 8, 0),
            ),
            Schedule(
                id=6,
                doctor_id=5,
                day=date(2024, 1, 23),
                start=time(21, 4, 0),
                finish=time(22, 4, 0),
            ),
            Schedule(
                id=7,
                doctor_id=10,
                day=date(2024, 1, 24),
                start=time(11, 2, 0),
                finish=time(12, 2, 0),
            ),
            Schedule(
                id=8,
                doctor_id=10,
                day=date(2024, 1, 24),
                start=time(15, 2, 0),
                finish=time(18, 2, 0),
            ),
        ]

        # Prepopulate doctors
        doctors = [
            Doctor(
                speciality=Speciality.Neurolog,
                id=1,
                username="dr_smith",
                email="drsmith@example.com",
                first_name="John",
                last_name="Smith",
                password="smith123",
                groupe="Doctor",
            ),
            Doctor(
                speciality=Speciality.Cardiolog,
                id=2,
                username="dr_jones",
                email="drjones@example.com",
                first_name="Emily",
                last_name="Jones",
                password="jones123",
                groupe="Doctor",
            ),
            Doctor(
                speciality=Speciality.Neurolog,
                id=3,
                username="dr_wilson",
                email="drwilson@example.com",
                first_name="James",
                last_name="Wilson",
                password="wilson123",
                groupe="Doctor",
            ),
            Doctor(
                speciality=Speciality.Pediatric,
                id=4,
                username="dr_taylor",
                email="drtaylor@example.com",
                first_name="Sophia",
                last_name="Taylor",
                password="taylor123",
                groupe="Doctor",
            ),
            Doctor(
                speciality=Speciality.Neurolog,
                id=5,
                username="dr_brown",
                email="drbrown@example.com",
                first_name="Liam",
                last_name="Brown",
                password="brown123",
                groupe="Doctor",
            ),
            Doctor(
                speciality=Speciality.Cardiolog,
                id=10,
                username="dr_clark",
                email="drclark@example.com",
                first_name="Olivia",
                last_name="Clark",
                password="clark123",
                groupe="Doctor",
            ),
        ] 

        visits = [
            Visit(visit_date=datetime(2024, 1, 17, 11, 9, 0), description='xxxxx', user_id=3, doctor_id=1, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 17, 11, 39, 0), description='how?', user_id=5, doctor_id=3, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 17, 11, 54, 0), user_id=3, doctor_id=1, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 19, 10, 23, 0), doctor_id=2, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 19, 10, 38, 0), doctor_id=2, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 19, 10, 53, 0), doctor_id=2, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 23, 21, 4, 0), description='need to take medicine', user_id=5, doctor_id=5, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 23, 21, 19, 0), doctor_id=5, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 23, 21, 34, 0), doctor_id=5, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 23, 21, 49, 0), user_id=16, doctor_id=5, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 11, 2, 0), description='right now ?', user_id=17, doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 11, 17, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 11, 32, 0), user_id=17, doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 11, 47, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 15, 2, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 15, 17, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 15, 32, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 15, 47, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 16, 2, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 16, 17, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 16, 32, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 16, 47, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 17, 2, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 17, 17, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 17, 32, 0), doctor_id=10, is_reserved=True),
            Visit(visit_date=datetime(2024, 1, 24, 17, 47, 0), doctor_id=10, is_reserved=True)
        ]
        
        db.add_all(users)
        db.add_all(schedules)
        db.add_all(doctors)
        db.add_all(visits)
        db.commit()
        db.close()

