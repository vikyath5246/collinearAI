from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from .hf_client import list_datasets, get_dataset_info
from .impact     import compute_impact
from ..schemas.dataset import DatasetOut
from ..models.models   import Dataset, FollowedDataset
from ..auth.security   import get_db, get_current_user

router = APIRouter()

# ────────────────────────────────────────────────────────────
@router.get("/datasets", response_model=List[DatasetOut])
def browse_datasets(search: str | None = Query(None),
                    db: Session = Depends(get_db)):
    raw = list_datasets(search=search)
    return [DatasetOut(hf_id=ds["id"],
                       description=ds.get("description"))
            for ds in raw]


@router.get("/datasets/{owner}/{name}", response_model=DatasetOut)
def dataset_detail(owner: str, name: str,
                   db: Session = Depends(get_db)):
    hf_id = f"{owner}/{name}"
    info  = get_dataset_info(hf_id)
    if not info:
        raise HTTPException(404, "Dataset not found")

    impact = compute_impact(size_bytes=info.get("cardData", {}).get("size"))

    # upsert cache
    ds = db.query(Dataset).filter(Dataset.hf_id == hf_id).first() or Dataset(hf_id=hf_id)
    ds.description   = info.get("description")
    ds.size_bytes    = info.get("cardData", {}).get("size")
    ds.impact_score  = impact
    db.add(ds); db.commit(); db.refresh(ds)
    return DatasetOut.from_orm(ds)

# ────────────────────────────────────────────────────────────
@router.post("/datasets/{owner}/{name}/follow", status_code=201)
def follow_dataset(owner: str, name: str,
                   db  : Session = Depends(get_db),
                   user= Depends(get_current_user)):
    hf_id = f"{owner}/{name}"
    ds = db.query(Dataset).filter(Dataset.hf_id == hf_id).first() or Dataset(hf_id=hf_id)
    db.add(ds); db.commit(); db.refresh(ds)

    if db.query(FollowedDataset)\
         .filter_by(user_id=user.id, dataset_id=ds.id).first():
        raise HTTPException(409, "Already followed")

    db.add(FollowedDataset(user_id=user.id, dataset_id=ds.id))
    db.commit()
    return {"message": "Followed"}

# ────────────────────────────────────────────────────────────
@router.delete("/datasets/{owner}/{name}/follow", status_code=204)
def unfollow_dataset(owner: str, name: str,
                     db  : Session = Depends(get_db),
                     user= Depends(get_current_user)):
    hf_id = f"{owner}/{name}"
    ds = db.query(Dataset).filter(Dataset.hf_id == hf_id).first()
    if not ds:
        raise HTTPException(404, "Dataset not found")

    link = db.query(FollowedDataset)\
             .filter_by(user_id=user.id, dataset_id=ds.id).first()
    if not link:
        raise HTTPException(404, "Not followed")

    db.delete(link); db.commit()

# ────────────────────────────────────────────────────────────
@router.get("/users/me/follows", response_model=List[DatasetOut])
def my_follows(db: Session = Depends(get_db),
               user=Depends(get_current_user)):
    rows = db.query(FollowedDataset).filter_by(user_id=user.id).all()
    out  = [db.get(Dataset, r.dataset_id) for r in rows]
    return [DatasetOut.from_orm(d) for d in out]
