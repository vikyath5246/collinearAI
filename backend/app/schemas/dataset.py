from typing import Optional
from pydantic import BaseModel

class DatasetOut(BaseModel):
    hf_id: str
    description: Optional[str] = None
    size_bytes: Optional[int] = None
    num_samples: Optional[int] = None
    download_count: Optional[int] = None
    impact_score: Optional[float] = None

    class Config:
        from_attributes = True
        # orm_mode = True
