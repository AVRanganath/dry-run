<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewSession extends Model
{
    protected $fillable = [
        'user_id',
        'job_title',
        'job_description',
        'resume_text',
        'status',
        'overall_score'
    ];

    protected $casts = [
        'overall_score' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'session_id');
    }
}
