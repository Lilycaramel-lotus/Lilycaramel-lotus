from fastapi import FastAPI

app = FastAPI()


class HealthCheck:
    pass


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/docs-check")
def docs_check():
    return {"message": "docs loaded"}
