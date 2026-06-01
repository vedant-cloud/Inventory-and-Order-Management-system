from pydantic import BaseModel, EmailStr, Field

# --- PRODUCTS ---
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float = Field(..., gt=0) # Price must be > 0
    quantity: int = Field(default=0, ge=0) # Quantity cannot be negative

class ProductCreate(ProductBase): pass

class ProductResponse(ProductBase):
    id: int
    class Config: from_attributes = True

# --- CUSTOMERS ---
class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr # Automatically validates standard email format
    phone_number: str

class CustomerCreate(CustomerBase): pass

class CustomerResponse(CustomerBase):
    id: int
    class Config: from_attributes = True

# --- ORDERS ---
class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int = Field(..., gt=0) # Must order at least 1 item

class OrderResponse(OrderCreate):
    id: int
    total_amount: float
    class Config: from_attributes = True