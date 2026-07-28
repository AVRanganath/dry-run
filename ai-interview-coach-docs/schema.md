# Database Schema

## `users`
* `id` (PK)
* `name` (String)
* `email` (String)
* `password` (String)
* `timestamps`

## `interview_sessions`
* `id` (PK)
* `user_id` (FK -> users.id)
* `job_title` (String)
* `job_description` (Text)
* `resume_text` (Text)
* `status` (Enum: 'pending', 'in_progress', 'completed')
* `overall_score` (Decimal, nullable)
* `timestamps`

## `questions`
* `id` (PK)
* `session_id` (FK -> interview_sessions.id)
* `question_text` (Text)
* `category` (String) - e.g., 'Behavioral', 'Technical', 'Experience'
* `order` (Integer)
* `timestamps`

## `answers`
* `id` (PK)
* `question_id` (FK -> questions.id)
* `answer_text` (Text)
* `score` (Integer) - 1 to 5
* `feedback` (Text)
* `strengths` (JSON)
* `improvements` (JSON)
* `timestamps`
