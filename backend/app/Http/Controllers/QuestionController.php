<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function storeAnswer(Request $request, $id, GeminiService $geminiService)
    {
        $validated = $request->validate([
            'answer_text' => 'required|string',
        ]);

        $question = Question::with('session')->findOrFail($id);
        $session = $question->session;
        
        if (!$session) {
            return response()->json(['message' => 'Session not found for this question.'], 404);
        }

        // Auto-assign session to current user if session was unassigned
        if (empty($session->user_id)) {
            $session->user_id = $request->user()->id;
            $session->save();
        } elseif ((int)$session->user_id !== (int)$request->user()->id) {
            return response()->json([
                'message' => 'You do not have permission to answer questions for this interview session.'
            ], 403);
        }
        
        // Ensure session is set to in_progress if it was pending
        if ($session->status === 'pending') {
            $session->status = 'in_progress';
            $session->save();
        }

        try {
            $evaluation = $geminiService->evaluateAnswer(
                $session->job_description,
                $question->question_text,
                $validated['answer_text']
            );
        } catch (\Exception $e) {
            $code = $e->getCode();
            $statusCode = ($code >= 400 && $code < 600) ? $code : 429;
            return response()->json([
                'message' => $e->getMessage()
            ], $statusCode);
        }

        $answer = Answer::updateOrCreate(
            ['question_id' => $question->id],
            [
                'answer_text' => $validated['answer_text'],
                'score' => $evaluation['score'] ?? null,
                'feedback' => $evaluation['feedback'] ?? null,
                'strengths' => $evaluation['strengths'] ?? [],
                'improvements' => $evaluation['improvements'] ?? []
            ]
        );

        // Check if all questions are answered
        $totalQuestions = $session->questions()->count();
        $answeredQuestions = Answer::whereIn('question_id', $session->questions()->pluck('id'))->count();

        if ($totalQuestions === $answeredQuestions) {
            $session->status = 'completed';
            
            // Calculate overall score
            $avgScore = Answer::whereIn('question_id', $session->questions()->pluck('id'))->avg('score');
            $session->overall_score = $avgScore ? round($avgScore, 2) : null;
            $session->save();
        }

        return response()->json($answer, 201);
    }
}
