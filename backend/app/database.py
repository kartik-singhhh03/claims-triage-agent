# backend/db.py
import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./backend/data/claims.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    status = Column(String, default="new")
    assigned_to = Column(String, default="unassigned")
    severity = Column(Integer, default=1)
    complexity = Column(String, default="low")
    fraud = Column(String, default="no")
    amount = Column(String, nullable=True)
    extracted_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
