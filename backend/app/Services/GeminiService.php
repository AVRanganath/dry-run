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

        if (!$response) {
            return $this->getMockQuestions();
        }

        try {
            $text = $this->extractTextFromResponse($response);
            $questions = $this->extractJsonArray($text);
            
            if (!is_array($questions) || empty($questions)) {
                Log::error('Gemini JSON decode error in generateQuestions. Raw text: ' . $text);
                return $this->getMockQuestions();
            }

            return $questions;
        } catch (\Exception $e) {
            Log::error('Gemini processing error in generateQuestions: ' . $e->getMessage());
            return $this->getMockQuestions();
        }
    }

    public function evaluateAnswer(string $jobDescription, string $questionText, string $answerText): array
    {
        if (empty($this->apiKey)) {
            return $this->getMockEvaluation();
        }

        $prompt = "You are an expert AI interview coach. Evaluate the candidate's answer to the interview question based on the job description. " .
                  "Return the response ONLY as a JSON object with the following fields: 'score' (integer 1-10), 'feedback' (string), 'strengths' (array of strings), and 'improvements' (array of strings). " .
                  "Job Description: " . $jobDescription . "\n" .
                  "Question: " . $questionText . "\n" .
                  "Answer: " . $answerText;

        $response = $this->callGeminiApi($prompt);

        if (!$response) {
            return $this->getMockEvaluation();
        }

        try {
            $text = $this->extractTextFromResponse($response);
            $evaluation = $this->extractJsonObject($text);

            if (!is_array($evaluation) || empty($evaluation)) {
                Log::error('Gemini JSON decode error in evaluateAnswer. Raw text: ' . $text);
                return $this->getMockEvaluation();
            }

            // Ensure safe types
            $score = isset($evaluation['score']) ? (int) $evaluation['score'] : 7;
            $score = max(1, min(10, $score));

            return [
                'score' => $score,
                'feedback' => (string) ($evaluation['feedback'] ?? 'Solid response.'),
                'strengths' => is_array($evaluation['strengths'] ?? null) ? $evaluation['strengths'] : ['Clear communication'],
                'improvements' => is_array($evaluation['improvements'] ?? null) ? $evaluation['improvements'] : ['Add specific metrics']
            ];
        } catch (\Exception $e) {
            Log::error('Gemini processing error in evaluateAnswer: ' . $e->getMessage());
            return $this->getMockEvaluation();
        }
    }

    private function callGeminiApi(string $prompt)
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
                'timeout' => 30
            ]
        ];

        $context  = stream_context_create($options);
        
        try {
            $result = file_get_contents($url, false, $context);
            if ($result === false) {
                return null;
            }
            return json_decode($result, true);
        } catch (\Exception $e) {
            Log::error('Gemini API call failed: ' . $e->getMessage());
            return null;
        }
    }

    private function extractTextFromResponse(array $response): string
    {
        if (isset($response['candidates'][0]['content']['parts'][0]['text'])) {
            return $response['candidates'][0]['content']['parts'][0]['text'];
        }
        if (isset($response['error'])) {
            Log::error('Gemini API error payload: ' . json_encode($response['error']));
        }
        throw new \Exception("Invalid response format from Gemini API");
    }

    private function extractJsonArray(string $text): ?array
    {
        $cleaned = preg_replace('/^```(?:json)?/m', '', $text);
        $cleaned = preg_replace('/```$/m', '', $cleaned);
        $cleaned = trim($cleaned);

        if (preg_match('/\[.*\]/s', $cleaned, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (is_array($decoded)) return $decoded;
        }

        $decoded = json_decode($cleaned, true);
        return is_array($decoded) ? $decoded : null;
    }

    private function extractJsonObject(string $text): ?array
    {
        $cleaned = preg_replace('/^```(?:json)?/m', '', $text);
        $cleaned = preg_replace('/```$/m', '', $cleaned);
        $cleaned = trim($cleaned);

        if (preg_match('/\{.*\}/s', $cleaned, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (is_array($decoded)) return $decoded;
        }

        $decoded = json_decode($cleaned, true);
        return is_array($decoded) ? $decoded : null;
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

    private function getMockEvaluation(): array
    {
        return [
            'score' => 7,
            'feedback' => 'This is a solid answer but could use more specific examples.',
            'strengths' => ['Clear communication', 'Relevant experience mentioned'],
            'improvements' => ['Provide concrete metrics', 'Be more concise']
        ];
    }
}
