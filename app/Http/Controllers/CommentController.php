<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Contract $contract)
    {
        abort_unless($contract->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'body' => 'required|string',
            'is_suggestion' => 'sometimes|boolean',
        ]);

        $user = auth()->user();

        $contract->comments()->create([
            'user_id' => $user->id,
            'author_name' => $user->name,
            'company' => 'Halcyon Industries',
            'initials' => collect(explode(' ', $user->name))->map(fn ($w) => strtoupper($w[0]))->join(''),
            'body' => $validated['body'],
            'is_suggestion' => $validated['is_suggestion'] ?? false,
        ]);

        return back()->with('success', 'Comment added.');
    }
}
