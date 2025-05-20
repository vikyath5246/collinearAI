from huggingface_hub import HfApi

hf_api = HfApi()

def list_datasets(search: str | None = None, limit: int = 50):
    """Return HF dataset metadata as list of dicts."""
    return [ds.__dict__ for ds in hf_api.list_datasets(search=search, limit=limit)]

def get_dataset_info(repo_id: str):
    """Return detailed info dict or None if not found."""
    try:
        return hf_api.dataset_info(repo_id).__dict__
    except Exception:
        return None
