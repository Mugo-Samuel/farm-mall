# 🌱 Farm Mall

A web application for managing farmers and agricultural activities, built as a technical assessment for Farm Mall.

## 🔗 Live Demo
[https://your-koyeb-url.koyeb.app](https://your-koyeb-url.koyeb.app)

> **Test Accounts:**
> - Admin: `admin@farmmall.com` / `admin123`
> - Farmer: `farmer@farmmall.com` / `farmer123`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Authentication | JWT + bcryptjs |
| Deployment | Koyeb |
| Bonus API | OpenWeatherMap |

---

## ✨ Features

### Authentication
- User registration and login
- Secure password hashing with bcryptjs (10 salt rounds)
- JWT-based session management (7 day expiry)
- Protected routes on both frontend and backend
- Role-based access control

### Admin Dashboard
- View total number of registered farmers
- Full farmer management (Add, View, Edit, Delete)
- Search farmers by name, email, location or crop
- Stats overview cards

### Farmer Dashboard
- Personalized welcome message
- Real-time weather lookup by city
- Weather-based farming insights (rule-based logic)
- General farming tips

### Bonus — Weather API Integration
- Powered by OpenWeatherMap API
- Returns temperature, humidity, wind speed, and conditions
- Rule-based farming insight engine:
  - 🌧️ Rain → Hold irrigation, great for planting
  - 🌡️ Temp > 35°C → Irrigation and shade net alert
  - ❄️ Temp < 10°C → Frost protection warning
  - 💧 Humidity > 80% → Fungal disease warning
  - ☀️ Clear sky → Good day for field work

---

## 🗄️ Database Schema

**Supabase (PostgreSQL)**

```sql
-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  email varchar(150) unique not null,
  password varchar(255) not null,
  role varchar(10) not null check (role in ('admin', 'farmer')),
  created_at timestamp default now()
);

-- Farmers table
create table farmers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name varchar(100) not null,
  email varchar(150) unique not null,
  location varchar(150),
  crop varchar(100),
  phone varchar(20),
  created_at timestamp default now()
);
```

---

## 🔐 Authentication Method

- Passwords hashed using **bcryptjs** with 10 salt rounds before storage
- On login, password is compared against the hash using `bcrypt.compare()`
- On success a signed **JWT token** is returned (expires in 7 days)
- Token is stored in **localStorage** on the frontend
- Every protected API request sends the token in the `Authorization: Bearer <token>` header
- Backend middleware verifies the token and attaches the user to the request
- Admin-only routes have an additional `isAdmin` middleware check

---

## 🌤️ API Integration

**OpenWeatherMap** — Free tier  
Endpoint: `GET /api/weather?city={city}`

The backend calls the OpenWeatherMap API, extracts temperature, humidity, wind speed and weather condition, then passes them through a rule-based insight engine to generate a farming recommendation tailored to current conditions.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- A Supabase account (free)
- An OpenWeatherMap API key (free)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Mugo-Samuel/farm-mall.git
cd farm-mall

# 2. Install server dependencies
cd server && npm install && cd ..

# 3. Install client dependencies
cd client && npm install && cd ..

# 4. Create environment file
cp .env.example server/.env
```

Fill in `server/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
WEATHER_API_KEY=your_openweathermap_key
PORT=5000
```

```bash
# 5. Run the backend
cd server && npm run dev

# 6. Run the frontend (new terminal)
cd client && npm run dev
```

Open **http://localhost:5173**

---

## 🎨 Design Decisions

| Decision | Reason |
|----------|--------|
| Single deployment (Express serves React build) | One URL, no CORS issues, simpler setup |
| Supabase over local PostgreSQL | Managed DB with free tier, built-in dashboard for easy data inspection |
| JWT over sessions | Stateless auth works well with a single-server deployment on Koyeb |
| Inline CSS over Tailwind | Tailwind requires a build step that caused issues in production — inline styles are 100% reliable |
| Rule-based weather insights | Keeps the feature lightweight and genuinely useful without overengineering |
| Role-based dashboards | Clean UX separation between admin and farmer experiences |

---

## 📁 Project Structure
farm-mall/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Navbar, FarmerModal, ProtectedRoute
│   │   ├── context/         # AuthContext (JWT state)
│   │   └── pages/           # Login, Register, AdminDashboard, FarmerDashboard
│   └── dist/                # Production build (served by Express)
├── server/                  # Node.js + Express backend
│   └── src/
│       ├── controllers/     # auth, farmer, weather logic
│       ├── middleware/       # JWT verification, role check
│       ├── routes/          # auth, farmer, weather routes
│       └── db/              # Supabase client
├── .env.example             # Environment variable template
├── Procfile                 # Koyeb deployment config
└── README.md

---

## 👨‍💻 Author

**Samuel Mwangi Mugo**  
GitHub: [@Mugo-Samuel](https://github.com/Mugo-Samuel)
