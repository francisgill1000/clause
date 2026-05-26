<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $userId = auth()->id();

        $stats = [
            'active_value' => Contract::where('user_id', $userId)
                ->where('status', 'active')
                ->sum('value'),
            'in_negotiation_count' => Contract::where('user_id', $userId)
                ->whereIn('status', ['review', 'signature'])
                ->count(),
            'avg_cycle_time' => 24, // placeholder — would calculate from real data
            'expiring_90_days_count' => Contract::where('user_id', $userId)
                ->where('status', 'expiring')
                ->count(),
        ];

        $queue = Contract::where('user_id', $userId)
            ->whereIn('status', ['review', 'signature'])
            ->with('counterparty')
            ->limit(4)
            ->get();

        $renewals = Contract::where('user_id', $userId)
            ->whereIn('status', ['active', 'expiring'])
            ->with('counterparty')
            ->limit(4)
            ->get();

        $pipeline = collect(['drafting', 'review', 'negotiation', 'signature', 'active'])->map(function ($stage) use ($userId) {
            $statusFilter = $stage === 'negotiation' ? 'review' : $stage;

            return [
                'name' => $stage,
                'count' => Contract::where('user_id', $userId)->where('status', $statusFilter)->count(),
                'value' => Contract::where('user_id', $userId)->where('status', $statusFilter)->sum('value'),
            ];
        });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'queue' => $queue,
            'renewals' => $renewals,
            'pipeline' => $pipeline,
        ]);
    }
}
