<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractParty extends Model
{
    protected $fillable = [
        'contract_id', 'kind', 'company_name', 'company_sub',
        'signer_name', 'signer_title', 'initials', 'signed', 'signed_at',
    ];

    protected $casts = [
        'signed' => 'boolean',
        'signed_at' => 'datetime',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
}
