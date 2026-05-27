<?php

namespace App\Http\Middleware;

use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $sidebarCounts = null;
        if ($request->user()) {
            $userId = $request->user()->id;
            $sidebarCounts = [
                'contracts' => Contract::where('user_id', $userId)->count(),
                'review' => Contract::where('user_id', $userId)->where('status', 'review')->count(),
                'signature' => Contract::where('user_id', $userId)->where('status', 'signature')->count(),
                'expiring' => Contract::where('user_id', $userId)->where('status', 'expiring')->count(),
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarCounts' => $sidebarCounts,
        ];
    }
}
