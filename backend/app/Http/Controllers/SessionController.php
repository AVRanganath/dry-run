<?php

namespace App\Http\Controllers;

use App\Models\InterviewSession;
use App\Models\Question;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $sessions = $request->user()->interviewSessions()->withCount('questions')->orderBy('created_at', 'desc')->get();
        return response()->json($sessions);
    }

    public function store(Request $request, GeminiService $geminiService)
    {
        $validated = $request->validate([
            'job_title' => 'nullable|string',
            'job_description' => 'required|string',
            'resume_text' => 'required|string',
        ]);

        $session = InterviewSession::create([
            'user_id' => $request->user()->id,
            'job_title' => $validated['job_title'] ?? null,
            'job_description' => $validated['job_description'],
            'resume_text' => $validated['resume_text'],
            'status' => 'pending',
        ]);

        try {
            $generatedQuestions = $geminiService->generateQuestions($session->job_description, $session->resume_text);

            foreach ($generatedQuestions as $index => $q) {
                Question::create([
                    'session_id' => $session->id,
                    'question_text' => $q['question'],
                    'category' => $q['category'] ?? 'General',
                    'order' => $index + 1,
                ]);
            }
        } catch (\Exception $e) {
            $session->delete();
            $code = $e->getCode();
            $statusCode = ($code >= 400 && $code < 600) ? $code : 429;
            return response()->json([
                'message' => $e->getMessage()
            ], $statusCode);
        }

        $session->load('questions');
        return response()->json($session, 201);
    }

    public function show(Request $request, $id)
    {
        $session = $request->user()->interviewSessions()->with(['questions.answer'])->findOrFail($id);
        return response()->json($session);
    }

    public function analytics(Request $request)
    {
        $userSessions = $request->user()->interviewSessions();
        $totalSessions = $userSessions->count();
        $avgScore = (clone $userSessions)->whereNotNull('overall_score')->avg('overall_score');
        
        $completedSessions = (clone $userSessions)->where('status', 'completed')->count();
        
        // Let's get category breakdowns from answers -> questions
        $categoryScores = \DB::table('answers')
            ->join('questions', 'answers.question_id', '=', 'questions.id')
            ->join('interview_sessions', 'questions.session_id', '=', 'interview_sessions.id')
            ->where('interview_sessions.user_id', $request->user()->id)
            ->select('questions.category', \DB::raw('AVG(answers.score) as average_score'))
            ->groupBy('questions.category')
            ->get();

        return response()->json([
            'total_sessions' => $totalSessions,
            'completed_sessions' => $completedSessions,
            'average_score' => $avgScore ? round($avgScore, 2) : null,
            'category_breakdown' => $categoryScores
        ]);
    }
}
