<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        if ($request->has('email')) {
            $request->merge(['email' => strtolower(trim($request->email))]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
        ], [
            'email.unique' => 'An account with this email address already exists.'
        ]);

        try {
            $user = User::create([
                'name' => trim($validated['name']),
                'email' => strtolower(trim($validated['email'])),
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return response()->json([
                'message' => 'An account with this email address already exists.',
                'errors' => ['email' => ['An account with this email address already exists.']]
            ], 422);
        } catch (\Throwable $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        if ($request->has('email')) {
            $request->merge(['email' => strtolower(trim($request->email))]);
        }

        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        try {
            $normalizedEmail = strtolower(trim($validated['email']));
            $user = User::where('email', $normalizedEmail)->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'message' => 'Invalid login credentials',
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Database error during login: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user()->loadCount('interviewSessions');
        
        return response()->json($user);
    }
}
