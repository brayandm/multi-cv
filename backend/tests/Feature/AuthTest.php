<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use DatabaseMigrations, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    private function register()
    {
        $response = $this->post(
            '/api/v1/register',
            [
                'first_name' => 'Testing',
                'last_name' => 'User',
                'email' => 'user@testing.com',
                'password' => '12345678',
            ]
        );

        $this->app->get('auth')->forgetGuards();

        return $response;
    }

    public function testRegister()
    {
        $response = $this->post(
            '/api/v1/register',
            [
                'first_name' => 'Testing',
                'last_name' => 'User',
                'email' => 'user@testing.com',
                'password' => '12345678',
            ]
        );

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'message',
        ]);

        $response->assertJsonPath('message', 'User created successfully');

        $this->assertDatabaseHas('users', ['first_name' => 'Testing', 'last_name' => 'User', 'email' => 'user@testing.com']);

        $this->app->get('auth')->forgetGuards();

        return $response;
    }

    public function testLogin()
    {
        //Register format incorrect

        $response = $this->post(
            '/api/v1/register',
            [
                'first_name' => 'Testing',
                'last_name' => 'User',
                'email' => 'user',
                'password' => '12345678',
            ]
        );

        $response->assertStatus(400);

        //Register

        $response = $this->register();

        //Login format incorrect

        $response = $this->post('/api/v1/login', [
            'email' => 'user',
            'password' => '12345678',
        ]);

        $response->assertStatus(400);

        $this->app->get('auth')->forgetGuards();

        //Login unauthenticated

        $response = $this->post('/api/v1/login', [
            'email' => 'user@testing.com',
            'password' => '123456789',
        ]);

        $response->assertStatus(401);

        $this->app->get('auth')->forgetGuards();

        //Login

        $response = $this->post('/api/v1/login', [
            'email' => 'user@testing.com',
            'password' => '12345678',
        ]);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'message',
            'auth_cookie' => [
                'name',
                'value',
                'expiration_date',
            ],
        ]);

        $this->app->get('auth')->forgetGuards();
    }
}
