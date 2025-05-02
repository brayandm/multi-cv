<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->boolean('is_in_talent_pool')->nullable();
            $table->timestamp('accepted_terms_at')->nullable();
            $table->timestamp('notified_terms_at')->nullable();
            $table->string('locale')->default('en');
            $table->string('app_theme')->nullable();
            $table->boolean('is_first_login')->default(true);
            $table->rememberToken();
            $table->timestamp('suspended_account_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
