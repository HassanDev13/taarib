<x-mail::message>
# رسالة تواصل جديدة

تم استلام رسالة تواصل جديدة من الموقع.

**الاسم:** {{ $contactMessage->name }}
**البريد الإلكتروني:** {{ $contactMessage->email }}
**الموضوع:** {{ $contactMessage->subject ?: 'بدون موضوع' }}

**الرسالة:**
{{ $contactMessage->message }}

يمكنك الرد على هذه الرسالة من خلال الرد المباشر على هذا البريد.

مع تحياتنا،<br>
{{ config('app.name') }}
</x-mail::message>
