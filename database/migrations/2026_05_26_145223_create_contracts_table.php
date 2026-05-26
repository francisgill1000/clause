<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('counterparty_id')->constrained()->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('contract_number')->unique();
            $table->string('title');
            $table->string('type');
            $table->string('status')->default('drafting');
            $table->decimal('value', 15, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->date('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->string('term')->nullable();
            $table->string('auto_renew')->nullable();
            $table->string('notice_period')->nullable();
            $table->unsignedTinyInteger('risk_score')->default(50);
            $table->unsignedTinyInteger('progress')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
