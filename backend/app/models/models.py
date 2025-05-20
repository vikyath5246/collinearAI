from datetime import datetime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import (
    Integer, String, BigInteger, Float, DateTime,
    ForeignKey, UniqueConstraint
)
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int]          = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str]    = mapped_column(String, unique=False)
    email: Mapped[str]       = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    follows = relationship("FollowedDataset", back_populates="user")


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[int]          = mapped_column(Integer, primary_key=True)
    hf_id: Mapped[str]       = mapped_column(String, unique=True, index=True)   # “owner/name”
    description: Mapped[str | None] = mapped_column(String)
    size_bytes: Mapped[int | None]  = mapped_column(BigInteger)
    num_samples: Mapped[int | None] = mapped_column(Integer)
    download_count: Mapped[int | None] = mapped_column(Integer)
    impact_score: Mapped[float | None] = mapped_column(Float)
    last_updated: Mapped[datetime | None] = mapped_column(DateTime)

    followers = relationship("FollowedDataset", back_populates="dataset")


class FollowedDataset(Base):
    __tablename__ = "followed_datasets"

    user_id:    Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    dataset_id: Mapped[int] = mapped_column(ForeignKey("datasets.id"), primary_key=True)
    followed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user    = relationship("User",    back_populates="follows")
    dataset = relationship("Dataset", back_populates="followers")

    __table_args__ = (UniqueConstraint("user_id", "dataset_id",
                                       name="uix_user_dataset"),)
