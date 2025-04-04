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
        Schema::table('quotas', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('last_reset_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotas', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
};
