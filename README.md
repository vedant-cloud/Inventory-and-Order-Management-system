# Inventory Management System

A full-stack, and fully containerized application designed to manage products, customers, and orders. Built with a focus on data integrity, scalable architecture, and production-ready DevOps practices.


## 🏗️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Context API, Axios, Nginx
* **Backend:** Python FastAPI, SQLAlchemy (ORM), Pydantic, PostgreSQL 15
* **DevOps:** Docker, Docker Compose, Render, Vercel

## ✨ Key Features
* **Interactive Dashboard:** Real-time metrics tracking total products, customers, and orders. Includes a dynamic "Low Stock Alert" modal to instantly view inventory needing attention.
* **Product Management:** Full CRUD capabilities with real-time stock tracking.
* **Customer Management:** Auto-generated, formatted Customer IDs (e.g., `CUST-0001`).
* **Advanced Order Logic:**
  * Placing an order automatically deducts the exact quantity from product inventory.
  * Canceling an order automatically restores the product inventory.
* **Data Integrity:** Prevents the deletion of any Product or Customer if they have active orders tied to them, avoiding orphaned database records.

## 📂 Project Structure
```text
inventory-management-system/
├── backend/
│   ├── main.py               # FastAPI application entry point
│   ├── database.py           # SQLAlchemy engine and session management
│   ├── models.py             # Database schemas
│   ├── routers/              # Modular API routes (products, customers, orders)
│   ├── Dockerfile            # Production-ready slim Python image
│   └── .dockerignore
├── frontend/
│   ├── src/                  # React components, pages, and context
│   ├── Dockerfile            # Multi-stage Vite build + Nginx server
│   └── .dockerignore
├── docker-compose.yml        # Orchestrates DB, Backend, and Frontend containers
└── .env                      # Secure environment variables 
```

## 💻 Local Setup Instructions

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine) installed and running.
* Git command-line tools.

### 1. Clone the Repository
```bash
git clone [https://github.com/username/inventory-management-system.git](https://github.com/username/inventory-management-system.git)
cd inventory-management-system
```

### 2. Configure Environment Variables
Create a `.env` file in the **root** directory of the project (at the same level as `docker-compose.yml`) and add the following secure credentials:
```text
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=inventory_db

DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
VITE_API_URL=http://localhost:8000
```

### 3. Build and Run via Docker Compose
Ensure your Docker daemon is running, then execute the following command to build the production-ready images and start the containers:
```bash
docker-compose up --build
```

### 4. Access the Application
Once the terminal shows that both Nginx and Uvicorn have started:
* **Frontend UI:** Open your browser and navigate to `http://localhost:5173`
* **Backend API:** Navigate to `http://localhost:8000`

### Stopping the Application
To shut down the application gracefully without losing your database data, press `Ctrl + C` in the terminal where it is running, or execute:
```bash
docker-compose down
```