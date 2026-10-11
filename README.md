# AI-Powered Student Career & Placement Management System

> **Department of Computer Science & Engineering**  
> *An intelligent, data-driven platform that connects student profiles, academic performance, and skill development with employer requirements — using machine learning to streamline campus placements from readiness assessment to final offer.*

---

## 📌 Abstract Overview

Campus placement processes in most academic institutions remain largely manual, fragmented, and reactive — relying on spreadsheets, physical resumes, and word-of-mouth coordination between placement cells, students, and recruiters. This often results in mismatched opportunities, delayed communication, and an inability to objectively gauge a student's true readiness for the job market. 

The **AI-Powered Student Career & Placement Management System** is a unified, intelligent web-based platform that automates and enhances every stage of the placement lifecycle:
- **Dynamic "Employability Score"**: Evaluates academic consistency (CGPA, backlog history), verified technical skills, certifications, and assessment metrics to compute a weighted readiness score (0–100) and identify skill gaps for target industry tracks.
- **NLP Recommendation Engine**: Performs semantic analysis using TF-IDF and Cosine Similarity on student resumes and job descriptions to objectively rank best-fit campus openings and assist recruiters in shortlisting.
- **AI Mock Interview & Aptitude Module**: Simulates real-time technical and behavioral interview rounds, evaluating verbal clarity, technical keyword hit rate, and problem-solving depth with instant actionable feedback and model answers.
- **Real-Time Institutional Analytics Dashboard**: Empowers placement officers (TPOs) and faculty coordinators with department-wise placement statistics, hiring trends, and predictive placement forecasting (featuring the **87% Placed** institutional benchmark from Fig 3).

---

## 🔄 System Workflow Pipeline

The platform implements the complete 5-stage placement lifecycle pipeline:

```
[Student Profile] ➔ [Skill Analysis] ➔ [AI Matching] ➔ [Interview Prep] ➔ [Placement]
```

1. **Student Profile**: Academic history, CGPA, verified technical skills, and NLP resume ingestion.
2. **Skill Analysis**: Multi-criteria employability calculation (Academic 30%, Technical Depth 30%, Aptitude 25%, Interview 15%) and target-role skill gap analysis.
3. **AI Matching**: Natural Language Processing matching candidate skill vectors against active corporate job descriptions with ranked fit percentages.
4. **Interview Prep**: AI-driven mock interviews with verbal audio/text response evaluation and interactive aptitude testing.
5. **Placement**: Real-time hiring pipeline tracking from Shortlisted to Final Offer Accepted, coupled with department analytics.

---

## 🚀 Key Modules & Capabilities

### 1. 🎓 Student Self-Service Portal
- **Dynamic Employability Scorecard**: Instant visualization of Tier rating (`Tier 1 - Elite`, `Tier 2 - Placement Ready`, `Tier 3 - Developing`, `Tier 4 - Foundational`), score breakdown radar, and benchmark targets.
- **AI Skill-Gap Analysis & Upskilling**: Automatically highlights missing core competencies for target tracks (SDE, Full Stack, AI/ML, Cloud DevOps, Data Analyst) and links to curated roadmaps.
- **NLP Resume Parser**: Extract skills, contact details, and qualifications directly from raw resume text.
- **AI Job Fit Recommendations**: 1-Click application to campus drives ranked by semantic match score with breakdown of matched and missing skills.
- **AI Mock Interview Simulator**: Select technical track, answer timed questions, and receive AI evaluations covering technical accuracy, communication clarity, and ideal model answers.
- **Aptitude & Coding Screening**: Timed quiz covering Quantitative, Logical Reasoning, and CS Fundamentals with instant score feedback.
- **Application Tracker**: Visual pipeline tracker (`Applied` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Offered`).

### 2. 💼 Recruiter Portal
- **Campus Drive Manager**: Create and post job openings with minimum CGPA thresholds, package (LPA), and required skill sets.
- **AI Candidate Ranker**: View student applicants ordered by NLP Cosine Similarity score.
- **Objective Shortlisting**: One-click candidate shortlisting, interview scheduling, and offer extensions.

### 3. 📊 Placement Officer (TPO) Dashboard
- **Replication of Abstract Fig 3**:
  - **87% Placed** circular gauge metric.
  - **Placement rate by department** bar chart (CSE: 92.4%, IT: 89.2%, ECE: 84.1%, MECH: 76.5%, CIVIL: 71.8%).
- **Institutional Key Metrics**: Total Students (1,240), Placed Count (1,079), Highest CTC (44.5 LPA), Average CTC (9.8 LPA), Active Recruiters (156).
- **Predictive Analytics**: 2022–2026 placement trajectory and salary growth forecasts.
- **Searchable Student Directory**: Live filter by department, CGPA, and status with 1-click CSV report export.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js (ES Modules), CORS, Dotenv |
| **AI / NLP Engine** | TF-IDF Vectorizer, Cosine Similarity, Tokenizer & Skill Extractor, Employability ML Heuristics |
| **Data Layer** | Thread-safe File-persisted JSON Data Store with pre-seeded datasets |

---

## 📂 Project Structure

```
├── backend/
│   ├── data/
│   │   ├── db.json                     # Persistent database with seeded students, jobs, applications
│   │   └── store.js                    # Data access layer & persistence operations
│   ├── routes/
│   │   ├── ai.js                       # Endpoints for NLP matching, mock interviews, aptitude
│   │   ├── analytics.js                # Endpoints for institutional analytics & trends
│   │   ├── applications.js             # Application submission & status lifecycle
│   │   ├── jobs.js                     # Job postings & recommendation queries
│   │   └── students.js                 # Student profiles & employability scoring
│   ├── services/
│   │   ├── employabilityEngine.js      # Dynamic 4-pillar employability scoring & gap analysis
│   │   ├── interviewEngine.js          # AI mock interview questions & answer rubric evaluator
│   │   └── nlpEngine.js                # NLP tokenizer, skill taxonomy, TF-IDF & cosine similarity
│   ├── .env.example
│   ├── package.json
│   └── server.js                       # Express server entry point (port 5000)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Role navigation & student selector
│   │   │   ├── SystemWorkflowBanner.jsx# 5-stage pipeline banner (Abstract Fig 2)
│   │   │   ├── OfficerDashboard/
│   │   │   │   └── PlacementAnalyticsDashboard.jsx # Fig 3 Analytics & Department Bar Chart
│   │   │   ├── RecruiterPortal/
│   │   │   │   └── RecruiterDashboard.jsx          # Job posting & NLP candidate ranker
│   │   │   └── StudentPortal/
│   │   │       ├── ApplicationsTracker.jsx         # Hiring pipeline progress tracker
│   │   │       ├── AptitudeAssessment.jsx          # Timed screening test with explanations
│   │   │       ├── EmployabilityScorecard.jsx      # Score radial, 4 pillars & upskilling
│   │   │       ├── JobRecommendations.jsx          # NLP ranked openings & 1-click apply
│   │   │       ├── MockInterviewModule.jsx         # Speech/text AI interview simulator
│   │   │       ├── ProfileManager.jsx              # Academic stats & skill manager
│   │   │       └── ResumeParserModal.jsx           # AI NLP resume parser modal
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API client
│   │   ├── App.jsx                     # Main portal shell
│   │   ├── index.css                   # Tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── package.json                        # Root workspace scripts
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/24eg107b52-lab/Ai-power-student-carrer-placment-managment-system.git
cd Ai-power-student-carrer-placment-managment-system
```

### 2. Install Dependencies
You can install dependencies for both backend and frontend from the root:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Run the Backend API Server
```bash
# In the backend directory
cd backend
npm start
```
The backend API server will start on **http://localhost:5000**.  
Verify health check at: `http://localhost:5000/api/health`

### 4. Run the Frontend Client
```bash
# In another terminal window, navigate to the frontend directory
cd frontend
npm run dev
```
Open **http://localhost:3000** (or the URL printed in the terminal) to explore the system!

---

## 🌐 API Reference Summary

- `GET /api/health` - Health check & system version
- `GET /api/students` - Retrieve student list with employability scores
- `GET /api/students/:id` - Detailed student profile & scorecard
- `PUT /api/students/:id` - Update profile & recalculate score
- `GET /api/jobs` - List live job openings (supports `?studentId=` for NLP match ranking)
- `POST /api/jobs` - Post a new campus hiring opening
- `POST /api/applications` - Submit student application
- `PATCH /api/applications/:id/status` - Update candidate stage (`Shortlisted`, `Offered`, etc.)
- `GET /api/ai/employability/:studentId` - Compute dynamic employability scorecard & skill gaps
- `POST /api/ai/parse-resume` - Run NLP entity & skill extraction on resume text
- `GET /api/ai/rank-candidates/:jobId` - Rank all students for a job using TF-IDF / Cosine similarity
- `GET /api/ai/interview-questions` - Fetch role-based technical questions
- `POST /api/ai/evaluate-interview` - AI evaluation of student verbal/written answers
- `GET /api/ai/aptitude-test` - Aptitude screening test questions
- `POST /api/ai/submit-aptitude` - Grade assessment and record score
- `GET /api/analytics/dashboard` - Department placement rates, 87% benchmark, and trend forecasts

---

## 👥 Authors & Academic Context

- **Department of Computer Science & Engineering**
- **System**: AI-Powered Student Career & Placement Management System
- **Repository**: [GitHub Link](https://github.com/24eg107b52-lab/Ai-power-student-carrer-placment-managment-system.git)
