from typing import Generator, Any
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, declarative_base

from database.settings import DB_SETTINGS


class DatabaseManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.engine = create_engine(
                DB_SETTINGS.url,
                pool_recycle=28000,
                pool_size=10,
                pool_pre_ping=True,
                echo=False
            )
            cls._instance.session_factory = sessionmaker(bind=cls._instance.engine, expire_on_commit=False)
        return cls._instance


Base = declarative_base()

# For creating tables on startup
engine = DatabaseManager().engine


def get_db_session() -> Generator[Session, Any, None]:
    session = DatabaseManager().session_factory()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
