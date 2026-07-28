<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class GeminiService
{
    private $apiKey;
    private $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
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
            $text = $this->cleanJsonResponse($text);
            $questions = json_decode($text, true);
            
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($questions)) {
                Log::error('Gemini JSON decode error in generateQuestions: ' . json_last_error_msg() . ' Text: ' . $text);
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
            $text = $this->cleanJsonResponse($text);
            $evaluation = json_decode($text, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($evaluation)) {
                Log::error('Gemini JSON decode error in evaluateAnswer: ' . json_last_error_msg() . ' Text: ' . $text);
                return $this->getMockEvaluation();
            }

            return $evaluation;
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
        throw new \Exception("Invalid response format from Gemini API");
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
