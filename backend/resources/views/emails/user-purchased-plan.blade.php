@component('mail::message')
# 💳 New Plan Purchased

A user just purchased a plan on your platform.

**Name:** {{ $user->first_name }} {{ $user->last_name }}

**Email:** {{ $user->email }}

**Plan:** {{ $planName }}

**Purchased at:** {{ now()->toDayDateTimeString() }}

Thanks,
{{ config('app.name') }}
@endcomponent