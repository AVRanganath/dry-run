<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'session_id',
        'question_text',
        'category',
        'order'
    ];

    public function session()
    {
        return $this->belongsTo(InterviewSession::class, 'session_id');
    }

    public function answer()
    {
        return $this->hasOne(Answer::class);
    }
}
