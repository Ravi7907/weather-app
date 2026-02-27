# 🌤️ SKYCAST — Weather Intelligence App

> A full-stack weather forecast web application built with a complete DevOps CI/CD pipeline.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=flat-square&logo=express)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=flat-square&logo=docker)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?style=flat-square&logo=github-actions)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=flat-square)

---

## 📌 Project Overview

**SKYCAST** is an academic DevOps project that demonstrates a complete software development and deployment lifecycle — from writing code to automated CI/CD pipelines and live cloud deployment.

The app fetches real-time weather data using the **OpenWeatherMap API** and displays it in a beautiful, fully responsive interface with advanced features like hourly charts, 7-day forecasts, dynamic themes, and GPS-based location detection.

---
<img width="423" height="911" alt="image" src="https://github.com/user-attachments/assets/d920327e-eecc-46af-a1d8-b4264c032de0" />
<img width="442" height="410" alt="image" src="https://github.com/user-attachments/assets/2d384658-378d-4b2b-9b9b-464715dcaaf2" />





## 🖥️ Live Demo

🌐 **https://weather-app-blush-phi-91.vercel.app/**

---

## ✨ Features

### Weather Features
- 📍 **Auto-detects device GPS location** on page load
- 🌡️ Current temperature, feels like, min/max
- 💧 Humidity, 💨 Wind speed & direction compass
- 👁️ Visibility, 🔼 Pressure, ☁️ Cloud cover
- 🌅 Sunrise & sunset with animated sun arc
- 📊 **24-hour forecast chart** (Temperature / Humidity / Wind)
- 📅 **7-day weather forecast** grid
- 🕐 Live local time for searched city

### Unique Features
- 👗 **Outfit Advisor** — recommends what to wear
- 🌙 **Moon Phase** tracker
- 📖 **Weather Story** — poetic description of conditions
- 💡 **Did You Know?** — rotating weather facts
- 🌧️ **Live particles** — rain drops, snowflakes, or stars based on weather

### Design & UX
- 🎨 **6 Manual Themes** — Midnight, Arctic, Desert, Forest, Ocean, Auto
- ☀️ **Auto theme** changes based on sunrise/sunset (Dawn → Day → Golden Hour → Night)
- 🕐 **12H / 24H** hour format toggle
- 🔍 Quick city buttons for fast search
- 📱 **Fully responsive** — Mobile, Tablet, Laptop, Desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js |
| Backend | Node.js + Express.js |
| Weather Data | OpenWeatherMap API |
| Containerization | Docker |
| Version Control | Git + GitHub |
| CI/CD Pipeline | GitHub Actions |
| Container Registry | Docker Hub |
| Deployment | Vercel |

---

## 🔄 DevOps Pipeline

```
Developer writes code
        ↓
git push to GitHub (main branch)
        ↓
GitHub Actions triggers automatically
        ↓
  ✅ Job 1 — Install dependencies & Run tests
        ↓
  ✅ Job 2 — Build Docker image → Push to Docker Hub
        ↓
  ✅ Job 3 — Deploy to Vercel
        ↓
Live app updates at vercel URL 🌐
```

---

## 📁 Project Structure

```
weather-app/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← CI/CD Pipeline
├── app/
│   ├── index.html            ← Frontend HTML
│   ├── style.css             ← Responsive CSS + Themes
│   └── script.js             ← Frontend Logic
├── server.js                 ← Express Backend Server
├── package.json              ← Project Dependencies
├── Dockerfile                ← Docker Configuration
├── vercel.json               ← Vercel Deployment Config
├── .dockerignore
├── .gitignore
└── README.md
```

---

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?city=London` | Current weather by city name |
| GET | `/api/forecast?city=London` | 5-day / 3-hour forecast |
| GET | `/api/weather-by-coords?lat=12.9&lon=77.6` | Weather by GPS coordinates |

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js v18+
- npm
- Docker Desktop
- OpenWeatherMap API Key (free at [openweathermap.org](https://openweathermap.org))

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Ravi7907/weather-app.git
cd weather-app
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Create Environment File
```bash
# Create .env file
touch .env
```

Add this inside `.env`:
```
WEATHER_API_KEY=your_openweathermap_api_key_here
PORT=3000
```

### Step 4 — Run Locally
```bash
node server.js
```

Open browser → **http://localhost:3000** ✅

---

## 🐳 Docker Setup

### Build Docker Image
```bash
docker build -t weather-app .
```

### Run Docker Container
```bash
docker run -p 3000:3000 -e WEATHER_API_KEY=your_api_key weather-app
```

Open browser → **http://localhost:3000** ✅

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEATHER_API_KEY` | OpenWeatherMap API key | ✅ Yes |
| `PORT` | Server port (default: 3000) | ❌ Optional |

---

## 📦 CI/CD Pipeline (GitHub Actions)

The pipeline runs automatically on every push to `main` branch.

**Pipeline Jobs:**

1. **Test** — Installs packages and runs tests
2. **Docker Build & Push** — Builds image and pushes to Docker Hub
3. **Deploy** — Deploys to Vercel

**Required GitHub Secrets:**

| Secret | Value |
|--------|-------|
| `WEATHER_API_KEY` | Your OpenWeatherMap API key |
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password |

---

## ☁️ Deployment (Vercel)

1. Connect GitHub repo to [Vercel](https://vercel.com)
2. Add `WEATHER_API_KEY` in Vercel Environment Variables
3. Every push to `main` auto-deploys 🚀

---

## 📸 Screenshots

### Desktop View
> Full dashboard with hero card, stats, chart, 7-day forecast

### Mobile View
> Fully responsive — all cards stack vertically on small screens

---

## 🎓 Academic Context

This project was built as part of an academic **DevOps course** to demonstrate:

| Concept | Implementation |
|---------|---------------|
| Version Control | Git & GitHub |
| Backend Development | Node.js + Express |
| API Integration | OpenWeatherMap REST API |
| Containerization | Docker + Dockerfile |
| CI/CD Automation | GitHub Actions |
| Container Registry | Docker Hub |
| Cloud Deployment | Vercel |
| Responsive Design | CSS3 Media Queries + clamp() |

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| API key not working | Wait 15 min after signup, or regenerate key |
| Location not detected | Allow browser location permission, must be HTTPS |
| Docker build fails | Ensure Docker Desktop is running |
| GitHub push fails | Use Personal Access Token with `repo` + `workflow` scope |
| Vercel 404 on API | Check `vercel.json` routes configuration |

---

## 👨‍💻 Author

**Ravi** — [@Ravi7907](https://github.com/Ravi7907)

---

## 📄 License

This project is for academic purposes.

---

*Built with ❤️ and a lot of DevOps learning*
