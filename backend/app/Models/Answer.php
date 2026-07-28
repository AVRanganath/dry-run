<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'question_id',
        'answer_text',
        'score',
        'feedback',
        'strengths',
        'improvements'
    ];

    protected $casts = [
        'strengths' => 'array',
        'improvements' => 'array',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
