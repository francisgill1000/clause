<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\CounterpartyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TemplateController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::resource('contracts', ContractController::class);
    Route::post('contracts/{contract}/comments', [CommentController::class, 'store'])->name('contracts.comments.store');
    Route::resource('counterparties', CounterpartyController::class)->except(['show', 'create', 'edit']);
    Route::resource('templates', TemplateController::class)->except(['show', 'create', 'edit']);

    // Placeholder routes
    Route::get('/inbox', fn() => Inertia::render('Placeholder', ['title' => 'Inbox', 'hint' => 'Counterparty responses and pending reviews land here.']))->name('inbox');
    Route::get('/signature', fn() => Inertia::render('Placeholder', ['title' => 'Awaiting Signature', 'hint' => 'Contracts you need to sign or that are out for counterparty signature.']))->name('signature');
    Route::get('/renewals', fn() => Inertia::render('Placeholder', ['title' => 'Renewals', 'hint' => 'Upcoming auto-renewals, notice windows, and renegotiation queues.']))->name('renewals');
    Route::get('/clauses', fn() => Inertia::render('Placeholder', ['title' => 'Clause Bank', 'hint' => 'Reusable, version-controlled clause library.']))->name('clauses');
    Route::get('/playbooks', fn() => Inertia::render('Placeholder', ['title' => 'Playbooks', 'hint' => 'Negotiation guidelines and fallback positions per contract type.']))->name('playbooks');
    Route::get('/team', fn() => Inertia::render('Placeholder', ['title' => 'Team']))->name('team');
    Route::get('/reports', fn() => Inertia::render('Placeholder', ['title' => 'Reports']))->name('reports');
    Route::get('/audit', fn() => Inertia::render('Placeholder', ['title' => 'Audit Log', 'hint' => 'Tamper-evident record of every action across every contract.']))->name('audit');
    Route::get('/settings', fn() => Inertia::render('Placeholder', ['title' => 'Settings']))->name('settings');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
