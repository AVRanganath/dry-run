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
        
        if ($question->session->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
        
        $session = $question->session;
        
        // Ensure session is set to in_progress if it was pending
        if ($session->status === 'pending') {
            $session->status = 'in_progress';
            $session->save();
        }

        $evaluation = $geminiService->evaluateAnswer(
            $session->job_description,
            $question->question_text,
            $validated['answer_text']
        );

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

        // Check if all questions in this session have an answer
        $totalQuestions = $session->questions()->count();
        $answeredQuestions = $session->questions()->has('answer')->count();

        if ($totalQuestions > 0 && $totalQuestions === $answeredQuestions) {
            $session->status = 'completed';
            
            // Calculate overall average score across all answered questions
            $questionIds = $session->questions()->pluck('id');
            $avgScore = Answer::whereIn('question_id', $questionIds)->whereNotNull('score')->avg('score');
            $session->overall_score = $avgScore ? round($avgScore, 2) : null;
            $session->save();
        }

        return response()->json($answer, 200);
    }
}
