from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter()

@router.post("", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    if db.query(models.Product).filter(models.Product.sku == product.sku).first():
        raise HTTPException(status_code=400, detail="SKU must be unique")
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.get("/{id}", response_model=schemas.ProductResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product: raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, req: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product: raise HTTPException(status_code=404, detail="Product not found")
    for key, value in req.model_dump().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product: 
        raise HTTPException(status_code=404, detail="Product not found")
    
    # NEW: Check if the product is tied to any active orders
    existing_order = db.query(models.Order).filter(models.Order.product_id == id).first()
    if existing_order:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete product because it has active orders. Please cancel the orders first."
        )

    db.delete(product)
    db.commit()