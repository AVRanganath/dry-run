<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class GeminiService
{
    private $apiKey;
    private $model;
    private $endpoint;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->model = env('GEMINI_MODEL', 'gemini-2.0-flash');
        $this->endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";
    }

    public function generateQuestions(string $jobDescription, string $resumeText): array
    {
        if (empty($this->apiKey)) {
            return $this->getMockQuestions();
        }

        $prompt = "You are an expert AI interview coach. Generate 5 interview questions based on the following job description and resume. " .
                  "Return the response ONLY as a JSON array of objects, where each object has 'question' (string) and 'category' (string: Behavioral, Technical, or Experience). " .
                  "Job Description: " . $jobDescription . "\n" .
                  "Resume: " . $resumeText;

        $response = $this->callGeminiApi($prompt);

        $text = $this->extractTextFromResponse($response);
        $text = $this->cleanJsonResponse($text);
        $questions = json_decode($text, true);
        
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($questions)) {
            Log::error('Gemini JSON decode error in generateQuestions: ' . json_last_error_msg() . ' Text: ' . $text);
            throw new \Exception('Failed to process AI response for questions. Please try again.', 500);
        }

        return $questions;
    }

    public function evaluateAnswer(string $jobDescription, string $questionText, string $answerText): array
    {
        if (empty($this->apiKey)) {
            return $this->getMockEvaluation($answerText, $questionText);
        }

        $prompt = "You are an expert AI interview coach. Evaluate the candidate's answer to the interview question based on the job description. " .
                  "Return the response ONLY as a JSON object with the following fields: 'score' (integer 1-10), 'feedback' (string), 'strengths' (array of strings), and 'improvements' (array of strings). " .
                  "Job Description: " . $jobDescription . "\n" .
                  "Question: " . $questionText . "\n" .
                  "Answer: " . $answerText;

        $response = $this->callGeminiApi($prompt);

        $text = $this->extractTextFromResponse($response);
        $text = $this->cleanJsonResponse($text);
        $evaluation = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($evaluation)) {
            Log::error('Gemini JSON decode error in evaluateAnswer: ' . json_last_error_msg() . ' Text: ' . $text);
            throw new \Exception('Failed to process AI response for evaluation. Please try again.', 500);
        }

        return $evaluation;
    }

    private function callGeminiApi(string $prompt): array
    {
        $data = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ];

        $url = $this->endpoint . '?key=' . $this->apiKey;

        $options = [
            'http' => [
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data),
                'ignore_errors' => true,
                'timeout' => 20,
            ]
        ];

        $context  = stream_context_create($options);
        
        $result = @file_get_contents($url, false, $context);
        if ($result === false) {
            throw new \Exception('Unable to reach AI evaluation service. Please check your connection and retry.', 503);
        }

        $decoded = json_decode($result, true);
        if (isset($decoded['error'])) {
            $errorCode = $decoded['error']['code'] ?? 500;
            $errorMsg = $decoded['error']['message'] ?? 'AI service error';
            
            if ($errorCode === 429 || stripos($errorMsg, 'quota') !== false || stripos($errorMsg, 'rate') !== false || stripos($errorMsg, 'exhausted') !== false) {
                throw new \Exception('AI rate limit / quota exceeded. Please wait a moment before trying again.', 429);
            }
            if ($errorCode === 503 || $errorCode === 500) {
                throw new \Exception('AI service is temporarily busy. Please wait a few seconds and try again.', 503);
            }
            throw new \Exception("AI Service Error: {$errorMsg}", $errorCode >= 400 && $errorCode < 600 ? $errorCode : 500);
        }

        if (!is_array($decoded)) {
            throw new \Exception('Invalid response received from AI service.', 502);
        }

        return $decoded;
    }

    private function extractTextFromResponse(array $response): string
    {
        if (isset($response['candidates'][0]['content']['parts'][0]['text'])) {
            return $response['candidates'][0]['content']['parts'][0]['text'];
        }
        throw new \Exception("Invalid response structure from Gemini API");
    }

    private function cleanJsonResponse(string $text): string
    {
        // Remove markdown formatting if present
        $text = preg_replace('/```json\s*/', '', $text);
        $text = preg_replace('/```\s*/', '', $text);
        return trim($text);
    }

    private function getMockQuestions(): array
    {
        return [
            ['question' => 'Can you tell me about yourself and your experience?', 'category' => 'Behavioral'],
            ['question' => 'Describe a time you solved a complex problem.', 'category' => 'Experience'],
            ['question' => 'How do you handle tight deadlines?', 'category' => 'Behavioral'],
            ['question' => 'What is your experience with the required tech stack?', 'category' => 'Technical'],
            ['question' => 'Why do you want to work here?', 'category' => 'Behavioral'],
        ];
    }

    private function getMockEvaluation(string $answerText = '', string $questionText = ''): array
    {
        $clean = trim($answerText);
        $len = strlen($clean);
        $words = str_word_count($clean);

        // Check for gibberish, very short inputs, or repetitive keyboard bashing
        $hasVowels = preg_match('/[aeiouy]/i', $clean);
        $isGibberish = ($len < 15) || ($words < 4) || !$hasVowels || preg_match('/(.)\1{4,}/', $clean);

        if ($isGibberish) {
            return [
                'score' => 1,
                'feedback' => 'The provided response does not contain sufficient intelligible content to evaluate. Please provide a clear, coherent response relevant to the question.',
                'strengths' => ['Submission received'],
                'improvements' => [
                    'Formulate a coherent response directly answering the prompt',
                    'Structure your response using the STAR methodology (Situation, Task, Action, Result)',
                    'Incorporate relevant industry terms and details'
                ]
            ];
        }

        if ($words < 15) {
            return [
                'score' => 3,
                'feedback' => 'The response is too brief to demonstrate full competence. Expand with specific examples, methodologies, and outcomes.',
                'strengths' => ['Direct and concise response'],
                'improvements' => [
                    'Elaborate on specific project context and actions taken',
                    'Highlight quantifiable impact and measurable results'
                ]
            ];
        }

        if ($words < 40) {
            return [
                'score' => 6,
                'feedback' => 'Good baseline response addressing the primary question. Adding detailed technical context and measurable metrics will elevate the evaluation.',
                'strengths' => [
                    'Clear communication',
                    'Relevant concepts addressed'
                ],
                'improvements' => [
                    'Provide concrete metrics and quantifiable achievements',
                    'Discuss trade-offs and decisions made during the process'
                ]
            ];
        }

        // Comprehensive response
        return [
            'score' => 8,
            'feedback' => 'Strong, well-structured response demonstrating domain expertise, practical problem solving, and clear communication.',
            'strengths' => [
                'Comprehensive explanation',
                'Strong contextual detail',
                'Professional articulation'
            ],
            'improvements' => [
                'Connect individual technical decisions to overarching business outcomes',
                'Mention future scalability or optimization opportunities'
            ]
        ];
    }
}
