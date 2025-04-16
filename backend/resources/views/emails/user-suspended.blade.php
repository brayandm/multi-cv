@component('mail::message')
# ⚠️ User Suspended

A user has been suspended from the platform.

**Name:** {{ $user->first_name }} {{ $user->last_name }}

**Email:** {{ $user->email }}

**User ID:** {{ $user->id }}

**Suspended at:** {{ \Carbon\Carbon::parse($user->suspended_account_at)->toDayDateTimeString() }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
