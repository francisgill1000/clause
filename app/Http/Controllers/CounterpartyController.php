<?php

namespace App\Http\Controllers;

use App\Models\Counterparty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CounterpartyController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $counterparties = Counterparty::where('user_id', $userId)
            ->withCount('contracts')
            ->withSum('contracts', 'value')
            ->get();

        return Inertia::render('Counterparties/Index', [
            'counterparties' => $counterparties,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'initials' => 'required|string|max:4',
            'domain' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'risk_tier' => 'sometimes|string|in:low,medium,high',
            'relationship_since' => 'nullable|date',
        ]);

        $validated['user_id'] = auth()->id();

        Counterparty::create($validated);

        return redirect()->route('counterparties.index')->with('success', 'Counterparty created.');
    }

    public function update(Request $request, Counterparty $counterparty)
    {
        abort_unless($counterparty->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'initials' => 'sometimes|string|max:4',
            'domain' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'risk_tier' => 'sometimes|string|in:low,medium,high',
            'relationship_since' => 'nullable|date',
        ]);

        $counterparty->update($validated);

        return redirect()->route('counterparties.index')->with('success', 'Counterparty updated.');
    }

    public function destroy(Counterparty $counterparty)
    {
        abort_unless($counterparty->user_id === auth()->id(), 403);

        $counterparty->delete();

        return redirect()->route('counterparties.index')->with('success', 'Counterparty deleted.');
    }
}
