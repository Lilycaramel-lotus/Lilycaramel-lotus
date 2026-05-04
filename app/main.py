from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import hashlib
import uuid

app = FastAPI()

class ExistonInput(BaseModel):
k: int
i: int
value: int

ledger = []

def validate(data):
if data.value not in [-1, 0, 1]:
raise HTTPException(status_code=400)
if not (0 <= data.i <= 27):
raise HTTPException(status_code=400)
if data.k < 0:
raise HTTPException(status_code=400)

def h(data):
return hashlib.sha256(f"{data.k}-{data.i}-{data.value}".encode()).hexdigest()

@app.post("/existon")
def create(data: ExistonInput):
validate(data)
entry = {
"k": data.k,
"i": data.i,
"value": data.value,
"hash": h(data),
"trace_id": str(uuid.uuid4())
}
ledger.append(entry)
return {"status": "OK", "trace_id": entry["trace_id"], "hash": entry["hash"]}

@app.get("/")
def root():
return {"status": "running"}from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import hashlib
import uuid

app = FastAPI()

class ExistonInput(BaseModel):
k: int
i: int
value: int

ledger = []

def validate(data):
if data.value not in [-1, 0, 1]:
raise HTTPException(status_code=400)
if not (0 <= data.i <= 27):
raise HTTPException(status_code=400)
if data.k < 0:
raise HTTPException(status_code=400)

def h(data):
return hashlib.sha256(f"{data.k}-{data.i}-{data.value}".encode()).hexdigest()

@app.post("/existon")
def create(data: ExistonInput):
validate(data)
entry = {
"k": data.k,
"i": data.i,
"value": data.value,
"hash": h(data),
"trace_id": str(uuid.uuid4())
}
ledger.append(entry)
return {"status": "OK", "trace_id": entry["trace_id"], "hash": entry["hash"]}

@app.get("/")
def root():
return {"status": "running"}
