 # 🚗 Vehicle Rental System API

## 📌 Overview
This is a backend API for a Vehicle Rental System where users can:
- Manage vehicles
- Register & login
- Create and manage bookings

---

## 🛠️ Tech Stack
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

---

## 🔐 Authentication
Use JWT token in headers:

Authorization: Bearer <token>

---

## 🌐 API Endpoints

### Auth
- POST /api/v1/auth/signup → Register
- POST /api/v1/auth/signin → Login

### Vehicles
- POST /api/v1/vehicles → Create (Admin)
- GET /api/v1/vehicles → Get all
- GET /api/v1/vehicles/:id → Get one
- PUT /api/v1/vehicles/:id → Update (Admin)
- DELETE /api/v1/vehicles/:id → Delete (Admin)

### Users
- GET /api/v1/users → Get all (Admin)
- PUT /api/v1/users/:id → Update
- DELETE /api/v1/users/:id → Delete (Admin)

### Bookings
- POST /api/v1/bookings → Create booking
- GET /api/v1/bookings → Get bookings
- PUT /api/v1/bookings/:id → Update booking

---

## 💡 Business Logic
- total_price = daily_rent_price × number_of_days
- Booking created → vehicle becomes "booked"
- Booking returned/cancelled → vehicle becomes "available"
- Customer can cancel before start date
- Admin can mark booking as returned
- Cannot delete user/vehicle with active bookings

---

## ▶️ Run Project

1. Install dependencies
npm install

2. Create .env file
PORT=5000
CONNECTION_STR=your_database_url
JWT_SECRET=your_secret

3. Run server
npm run dev

---

## 📦 Response Format

Success:
{
  "success": true,
  "message": "Success message",
  "data": {}
}

Error:
{
  "success": false,
  "message": "Error message"
}

---

## 👨‍💻 Author
Mohammad Masum
