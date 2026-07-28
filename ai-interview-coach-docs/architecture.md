# AI Mock Interview Coach - System Architecture

## 1. System Overview
The AI Mock Interview Coach is an end-to-end web application that allows users to practice interviews tailored to specific job descriptions and their own resumes. It evaluates answers against a fixed rubric and tracks progress over time.

## 2. Tech Stack
* **Frontend**: Next.js (App Router), React, Tailwind CSS (for layout and base styles, highly customized for the tactile aesthetic).
* **Backend**: Laravel (PHP 8.x).
* **Database**: PostgreSQL (recommended for robust relational data and JSON support) or MySQL.
* **AI Provider**: Google Gemini API (Gemini 1.5 Flash). It offers a very generous free tier, incredibly fast response times, and large context windows (perfect for processing long resumes and JDs without truncation).
* **Authentication**: Laravel Sanctum (API token authentication for SPAs).

## 3. Core Architecture
The system follows a decoupled Headless architecture:
* **Next.js Frontend** acts as a Single Page Application (SPA) consuming the Laravel API.
* **Laravel Backend** serves purely as a RESTful API and orchestrates database operations, authentication, and communication with the Gemini API.

## 4. Key Workflows
### A. Interview Setup
1. User logs in.
2. User submits a Job Description (text) and Resume (text or PDF).
3. Laravel backend receives data, calls the Gemini API with a strict system prompt to generate `N` tailored interview questions.
4. Questions are saved to the database linked to a new `InterviewSession`.
5. Frontend navigates user to the active interview view.

### B. Interview Execution & Evaluation
1. Frontend displays questions one by one.
2. User submits an answer (typed text, or transcribed audio if implemented).
3. Backend receives the answer and sends it to Gemini API along with the Question, Job Description, and a **Fixed Scoring Rubric** (e.g., STAR method adherence, communication clarity, technical accuracy).
4. Gemini evaluates the answer, returning a structured JSON response containing: Score (1-5), Strengths, Areas for Improvement, and an Ideal Answer snippet.
5. Evaluation is saved to the database and returned to the frontend.

### C. Progress Tracking
1. Dashboard aggregates scores across sessions.
2. Analytics endpoint calculates average scores per rubric category (e.g., Technical, Communication, Problem Solving) to track progress across sessions.

## 5. AI Integration Strategy
To ensure the AI behaves predictably and returns easily parseable data for our Next.js frontend, we will use **Structured Outputs (JSON Schema)** with the Gemini API. 

**Prompt 1: Question Generation**
* Input: JD, Resume.
* Output: JSON array of objects `{ "question": "...", "category": "..." }`.

**Prompt 2: Answer Evaluation**
* Input: JD, Question, User Answer, Rubric guidelines.
* Output: JSON object `{ "score": 4, "feedback": "...", "missing_points": [...] }`.
