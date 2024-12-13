from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Service(BaseModel):
    id: str
    name: str
    description: str
    price: float
    duration: str

class ContactInfo(BaseModel):
    email: str
    phone: str
    address: str

class Business(BaseModel):
    id: str
    name: str
    description: str
    category: str
    location: str
    rating: float
    services: List[Service]
    contact: ContactInfo

class JobRequest(BaseModel):
    id: str
    title: str
    description: str
    budget: float
    status: str
    category: str
    location: str
    created_at: str

# Mock data
businesses = []
job_requests = []

@app.get("/")
async def read_root():
    return {"message": "Welcome to LocalBiz API"}

@app.get("/api/businesses")
async def get_businesses(
    search: Optional[str] = None,
    category: Optional[str] = None
):
    filtered = businesses
    
    if search:
        filtered = [b for b in filtered if search.lower() in b.name.lower() or search.lower() in b.description.lower()]
    
    if category:
        filtered = [b for b in filtered if b.category.lower() == category.lower()]
    
    return filtered

@app.get("/api/businesses/{business_id}")
async def get_business(business_id: str):
    business = next((b for b in businesses if b.id == business_id), None)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@app.get("/api/jobs")
async def get_jobs(
    status: Optional[str] = None,
    category: Optional[str] = None
):
    filtered = job_requests
    
    if status:
        filtered = [j for j in filtered if j.status == status]
    
    if category:
        filtered = [j for j in filtered if j.category == category]
    
    return filtered

@app.post("/api/jobs")
async def create_job(job: JobRequest):
    job_requests.append(job)
    return job

# Add some sample data
sample_business = Business(
    id=str(uuid4()),
    name="Home Pro Services",
    description="Professional home maintenance and repair services",
    category="home",
    location="New York, NY",
    rating=4.8,
    services=[
        Service(
            id=str(uuid4()),
            name="Basic Home Inspection",
            description="Comprehensive home inspection service",
            price=150.00,
            duration="2 hours"
        )
    ],
    contact=ContactInfo(
        email="contact@homepro.com",
        phone="(555) 123-4567",
        address="123 Main St, New York, NY"
    )
)

businesses.append(sample_business)