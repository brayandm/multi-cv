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
        Schema::create('quotas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->index('quotas_user_id_foreign');
            $table->unsignedBigInteger('payment_plan_id');
            $table->string('action');
            $table->integer('quota');
            $table->string('frequency');
            $table->boolean('cumulative')->default(false);
            $table->integer('left')->default(0);
            $table->integer('max_left')->default(-1);
            $table->integer('pending')->default(0);
            $table->integer('max_pending')->default(-1);
            $table->integer('failed')->default(0);
            $table->integer('max_failed')->default(-1);
            $table->integer('total_failed')->default(0);
            $table->integer('total_succeeded')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('last_reset_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['payment_plan_id', 'user_id', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quotas');
    }
};
