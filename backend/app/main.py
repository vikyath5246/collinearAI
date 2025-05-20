from fastapi import FastAPI
from .core.database import Base, engine
from .auth.router    import router as auth_router
from .datasets.router import router as ds_router

def create_app() -> FastAPI:
    app = FastAPI(title="HF Dataset Explorer API", version="1.0.0")
    Base.metadata.create_all(bind=engine)     # auto DDL for dev
    app.include_router(auth_router, tags=["Auth"])
    app.include_router(ds_router,  tags=["Datasets"])

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app

app = create_app()
