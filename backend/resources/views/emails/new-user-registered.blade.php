@component('mail::message')
# 👤 New User Registered

A new user just signed up on your platform.

**Name:** {{ $user->first_name }} {{ $user->last_name }}

**Email:** {{ $user->email }}

**Registered at:** {{ $user->created_at->toDayDateTimeString() }}

Thanks,
{{ config('app.name') }}
@endcomponent
