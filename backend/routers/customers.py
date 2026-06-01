from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter()

@router.post("", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    if db.query(models.Customer).filter(models.Customer.email == customer.email).first():
        raise HTTPException(status_code=400, detail="Email must be unique")
    new_customer = models.Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.get("", response_model=List[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@router.get("/{id}", response_model=schemas.CustomerResponse)
def get_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer: raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{id}", response_model=schemas.CustomerResponse)
def update_customer(id: int, req: schemas.CustomerCreate, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer: 
        raise HTTPException(status_code=404, detail="Customer not found")
    
    existing = db.query(models.Customer).filter(models.Customer.email == req.email, models.Customer.id != id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use by another customer")

    for key, value in req.model_dump().items():
        setattr(customer, key, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer: 
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # NEW: Check if the customer has any active orders
    existing_order = db.query(models.Order).filter(models.Order.customer_id == id).first()
    if existing_order:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete customer because they have active orders. Please cancel their orders first."
        )

    db.delete(customer)
    db.commit()