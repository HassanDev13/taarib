<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $contactMessage = ContactMessage::create($validated);

        try {
            \Illuminate\Support\Facades\Mail::to('zerrouk.mohammed.hacene@gmail.com')
                ->send(new \App\Mail\ContactNotification($contactMessage));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send contact notification email: ' . $e->getMessage());
        }

        return response()->json(['message' => 'تم استلام رسالتك بنجاح. سنتواصل معك قريباً.']);
    }
}
