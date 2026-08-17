from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from app.core.config import settings

_engine: AsyncEngine | None = None
_async_session_factory: async_sessionmaker[AsyncSession] | None = None


def get_engine(database_url: str | None = None) -> AsyncEngine:
    global _engine
    url = database_url or settings.DATABASE_URL
    if _engine is None or database_url is not None:
        _engine = create_async_engine(
            url,
            echo=False,
            future=True,
        )
    return _engine


def get_session_factory(database_url: str | None = None) -> async_sessionmaker[AsyncSession]:
    global _async_session_factory
    engine = get_engine(database_url)
    if _async_session_factory is None or database_url is not None:
        _async_session_factory = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
    return _async_session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency generator for FastAPI database sessions."""
    session_factory = get_session_factory()
    async with session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
