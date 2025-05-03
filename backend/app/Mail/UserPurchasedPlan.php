<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserPurchasedPlan extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $planName;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $planName)
    {
        $this->user = $user;
        $this->planName = $planName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Plan Purchase: ' . $this->user->name . ' bought ' . $this->planName,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.user-purchased-plan',
            with: [
                'user' => $this->user,
                'planName' => $this->planName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
