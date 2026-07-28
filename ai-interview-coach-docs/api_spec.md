# API Design (Laravel REST API)

All endpoints are prefixed with `/api/v1` and require a Bearer Token (Sanctum) unless noted.

## Authentication
* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/logout`
* `GET /user`

## Interview Sessions
* `GET /sessions`
  * List all past sessions with overall scores and dates.
* `POST /sessions` 
  * Create a new session. 
  * Payload: `{ job_description: string, resume_text: string }`
  * Action: Calls AI to generate questions, saves session and questions to DB, returns session ID.
* `GET /sessions/{id}` 
  * Get session details including the list of generated questions.

## Interview Execution
* `POST /questions/{id}/answer` 
  * Submit an answer for a specific question.
  * Payload: `{ answer_text: string }`
  * Action: Calls AI to evaluate the answer against the rubric, saves the answer and feedback to DB, returns score and feedback.
  
## Analytics
* `GET /analytics/progress` 
  * Returns aggregated stats for the dashboard (e.g., average score over time, strongest categories, weakest categories).
