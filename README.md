# 💰 ExpenseIQ — Smart Expense Tracker

A full-stack expense tracking application built with **Spring Boot**, **React**, and **MySQL**. Features real-time spending analytics, category-wise breakdowns, and interactive charts.

🔗 **[Live Demo](https://expense-tracker-jb09xmmgw-vaishnavi-patils-projects-fb2312ff.vercel.app/)**

---

## ✨ Features

- 📊 **Dashboard** — Monthly overview with pie chart and recent transactions
- ➕ **Add Expenses** — Form with validation, category selection, and date picker
- 📋 **Expense List** — Search, filter by category, delete entries
- 📈 **Monthly Summary** — Bar chart with category breakdown and percentages
- 🌐 **REST API** — 7 endpoints powering the full frontend
- ☁️ **Deployed** — Live on Vercel + Render + Aiven MySQL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Recharts |
| Backend | Java 24, Spring Boot 3.5, Spring Data JPA |
| Database | MySQL 8.0 (Aiven cloud) |
| Deployment | Vercel (frontend), Render (backend) |
| Tools | Docker, GitHub, Maven, Postman |

---

## 🏗️ Architecture

```
React Frontend (Vercel)
        │  axios HTTP calls
        ▼
Spring Boot REST API (Render :8080)
        │  Spring Data JPA
        ▼
MySQL Database (Aiven cloud)
```

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   └── src/main/java/com/vaishnavi/expense_tracker/
│       ├── controller/
│       ├── model/
│       └── repository/
└── frontend/
    └── src/
        ├── pages/
        ├── services/
        └── App.jsx
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses |
| POST | `/expenses` | Add new expense |
| PUT | `/expenses/{id}` | Update expense |
| DELETE | `/expenses/{id}` | Delete expense |
| GET | `/expenses/category/{category}` | Filter by category |
| GET | `/expenses/range?start=&end=` | Filter by date range |
| GET | `/expenses/summary/{year}/{month}` | Monthly summary |

---

## ⚙️ Running Locally

### Backend
```bash
cd backend
set DB_PASSWORD=your_mysql_password
.\mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Upcoming
- JWT Authentication (multi-user)
- CSV export
- AI expense categorization (Gemini API)
- GitHub Actions CI/CD
