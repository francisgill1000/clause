<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    protected $fillable = [
        'user_id', 'counterparty_id', 'owner_id', 'contract_number', 'title', 'type',
        'status', 'value', 'currency', 'start_date', 'end_date', 'term',
        'auto_renew', 'notice_period', 'risk_score', 'progress',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'start_date' => 'date',
        'risk_score' => 'integer',
        'progress' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function counterparty(): BelongsTo
    {
        return $this->belongsTo(Counterparty::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function parties(): HasMany
    {
        return $this->hasMany(ContractParty::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class)->orderBy('sort_order');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class)->latest();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }
}
