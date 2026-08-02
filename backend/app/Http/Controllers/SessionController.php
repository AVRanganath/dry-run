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

        $generatedQuestions = $geminiService->generateQuestions($session->job_description, $session->resume_text);
        if (empty($generatedQuestions) || !is_array($generatedQuestions)) {
            $generatedQuestions = [
                ['question' => 'Can you walk me through your background and how it aligns with this role?', 'category' => 'Experience'],
                ['question' => 'Describe a complex challenge you encountered in a recent project and how you resolved it.', 'category' => 'Experience'],
                ['question' => 'How do you prioritize competing deadlines and manage high-pressure situations?', 'category' => 'Behavioral'],
                ['question' => 'What technical methodologies or architectures are you most proficient with?', 'category' => 'Technical'],
                ['question' => 'Why are you specifically interested in this opportunity and company?', 'category' => 'Behavioral'],
            ];
        }

        foreach ($generatedQuestions as $index => $q) {
            Question::create([
                'session_id' => $session->id,
                'question_text' => $q['question'] ?? 'Please describe your relevant experience.',
                'category' => $q['category'] ?? 'General',
                'order' => $index + 1,
            ]);
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
        
        // Category breakdowns from answers -> questions
        $categoryScores = \DB::table('answers')
            ->join('questions', 'answers.question_id', '=', 'questions.id')
            ->join('interview_sessions', 'questions.session_id', '=', 'interview_sessions.id')
            ->where('interview_sessions.user_id', $request->user()->id)
            ->whereNotNull('answers.score')
            ->select(
                \DB::raw("COALESCE(questions.category, 'General') as category"),
                \DB::raw('ROUND(AVG(answers.score)::numeric, 2) as average_score')
            )
            ->groupBy(\DB::raw("COALESCE(questions.category, 'General')"))
            ->get();

        return response()->json([
            'total_sessions' => $totalSessions,
            'completed_sessions' => $completedSessions,
            'average_score' => $avgScore ? round($avgScore, 2) : null,
            'category_breakdown' => $categoryScores
        ]);
    }
}
