<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/v1/auth/register', [AuthController::class, 'register']);
Route::post('/v1/auth/login', [AuthController::class, 'login']);
Route::get('/v1/health', fn() => response()->json(['status' => 'ok']));

// Protected routes (require auth)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    Route::get('/sessions', [SessionController::class, 'index']);
    Route::post('/sessions', [SessionController::class, 'store']);
    Route::get('/sessions/{id}', [SessionController::class, 'show']);
    
    Route::post('/questions/{id}/answer', [QuestionController::class, 'storeAnswer']);
    
    Route::get('/analytics/progress', [SessionController::class, 'analytics']);
});
