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
        Schema::table('actions', function (Blueprint $table) {
            $table->unsignedBigInteger('payment_plan_id')->after('user_id');
            $table->foreign('payment_plan_id')->references('id')->on('payment_plans');
            $table->index(['payment_plan_id', 'user_id', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actions', function (Blueprint $table) {
            $table->dropForeign(['payment_plan_id']);
            $table->dropColumn('payment_plan_id');
            $table->dropIndex(['payment_plan_id', 'user_id', 'action']);
        });
    }
};
