<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Counterparty;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = auth()->id();

        $contracts = Contract::where('user_id', $userId)
            ->with(['counterparty', 'owner'])
            ->latest()
            ->get();

        $counts = [
            'all' => $contracts->count(),
            'drafting' => $contracts->where('status', 'drafting')->count(),
            'review' => $contracts->where('status', 'review')->count(),
            'signature' => $contracts->where('status', 'signature')->count(),
            'active' => $contracts->where('status', 'active')->count(),
            'expiring' => $contracts->where('status', 'expiring')->count(),
        ];

        $stats = [
            'total_value' => $contracts->sum('value'),
            'active_count' => $contracts->where('status', 'active')->count(),
            'avg_risk' => $contracts->avg('risk_score'),
        ];

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
            'counts' => $counts,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        $userId = auth()->id();

        return Inertia::render('Contracts/Create', [
            'counterparties' => Counterparty::where('user_id', $userId)->get(),
            'users' => User::all(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'counterparty_id' => 'required|exists:counterparties,id',
            'owner_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'status' => 'sometimes|string|in:drafting,review,signature,active,expiring',
            'value' => 'nullable|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|string|max:50',
            'term' => 'nullable|string|max:50',
            'auto_renew' => 'nullable|string|max:50',
            'notice_period' => 'nullable|string|max:50',
            'risk_score' => 'nullable|integer|min:0|max:100',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $year = now()->year;
        $lastContract = Contract::where('contract_number', 'like', "CL-{$year}-%")
            ->orderByDesc('contract_number')
            ->first();

        $nextNumber = $lastContract
            ? intval(substr($lastContract->contract_number, -4)) + 1
            : 1;

        $validated['contract_number'] = sprintf('CL-%d-%04d', $year, $nextNumber);
        $validated['user_id'] = auth()->id();
        $validated['owner_id'] = $validated['owner_id'] ?? auth()->id();

        $contract = Contract::create($validated);

        return redirect()->route('contracts.show', $contract)->with('success', 'Contract created.');
    }

    public function show(Contract $contract): Response
    {
        $this->authorizeAccess($contract);

        $contract->load([
            'counterparty',
            'owner',
            'parties',
            'milestones',
            'activities',
            'comments',
        ]);

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    public function edit(Contract $contract): Response
    {
        $this->authorizeAccess($contract);

        $userId = auth()->id();

        return Inertia::render('Contracts/Edit', [
            'contract' => $contract->load('counterparty'),
            'counterparties' => Counterparty::where('user_id', $userId)->get(),
            'users' => User::all(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, Contract $contract)
    {
        $this->authorizeAccess($contract);

        $validated = $request->validate([
            'counterparty_id' => 'sometimes|exists:counterparties,id',
            'owner_id' => 'nullable|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:100',
            'status' => 'sometimes|string|in:drafting,review,signature,active,expiring',
            'value' => 'nullable|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|string|max:50',
            'term' => 'nullable|string|max:50',
            'auto_renew' => 'nullable|string|max:50',
            'notice_period' => 'nullable|string|max:50',
            'risk_score' => 'nullable|integer|min:0|max:100',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $contract->update($validated);

        return redirect()->route('contracts.show', $contract)->with('success', 'Contract updated.');
    }

    public function destroy(Contract $contract)
    {
        $this->authorizeAccess($contract);

        $contract->delete();

        return redirect()->route('contracts.index')->with('success', 'Contract deleted.');
    }

    private function authorizeAccess(Contract $contract): void
    {
        abort_unless($contract->user_id === auth()->id(), 403);
    }
}
