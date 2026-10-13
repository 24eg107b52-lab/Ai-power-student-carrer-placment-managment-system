# AI-Powered Student Career & Placement Management System

AI-powered full-stack placement management platform built with **Spring Boot 3 (Java 21)** backend and a **modern HTML/CSS/JS** frontend.

## 🌐 Live Demo

- **Frontend (Vercel):** [https://ai-power-student-carrer-placment-managment-system.vercel.app](https://ai-power-student-carrer-placment-managment-system.vercel.app)
- **Backend API (Render):** [https://ai-placement-api.onrender.com](https://ai-placement-api.onrender.com)

## 🚀 Features

- Dynamic AI Employability Scoring (Multi-criteria ML)
- NLP TF-IDF Cosine Similarity Job Matching
- AI Mock Interview Simulator (Web Speech API)
- Aptitude Test & Auto-Grading
- Placement Analytics Dashboard (Fig 3)
- Recruiter Candidate Screening & Auto-Shortlisting
- Resume NLP Parser
- Skill-Gap Upskilling Recommendations

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.3.4 |
| Database | H2 In-Memory Database |
| ML/NLP | Custom Java ML Engines (TF-IDF, Cosine Similarity, Logistic Regression) |
| Frontend | HTML5, CSS3, Vanilla JS, Chart.js |
| Deploy Backend | Render (Free Tier) |
| Deploy Frontend | Vercel (Free Tier) |

## 📂 Project Structure

```
├── backend/          ← Spring Boot Application
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
└── frontend/         ← Static HTML/CSS/JS
    ├── index.html
    ├── css/
    └── js/
```

## 🔧 Local Development

### Backend
```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### Frontend
```bash
cd frontend
# Simply open index.html in browser
# Or use Live Server in VS Code
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | All students ranked by employability |
| GET | `/api/students/{id}/score-breakdown` | ML Score breakdown |
| POST | `/api/students/{id}/resume` | AI Resume Parser |
| GET | `/api/matching/recommendations/{studentId}` | NLP Job Recommendations |
| POST | `/api/interview/evaluate` | AI Interview Evaluation |
| GET | `/api/analytics/dashboard` | Dashboard (Fig 3) |
| GET | `/api/analytics/export` | Export placement CSV |

## 👤 Author

**Vivek Sambale**  
GitHub: [@viveksambale](https://github.com/viveksambale)
