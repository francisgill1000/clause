<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Milestone extends Model
{
    protected $fillable = [
        'contract_id', 'name', 'target_date', 'is_completed', 'is_next', 'sort_order',
    ];

    protected $casts = [
        'target_date' => 'date',
        'is_completed' => 'boolean',
        'is_next' => 'boolean',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
}
