<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserSettingsController extends Controller
{
    public function edit(Request $request)
    {
        $specialities = \App\Models\Speciality::whereNull('parent_id')->with('children')->get();
        return inertia('Settings', [
            'specialities' => $specialities
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$request->user()->id,
            'linkedin_url' => 'required|url|max:255',
            'speciality_id' => 'required|exists:specialities,id',
            'years_of_experience' => 'required|integer|min:0|max:100',
            'about_me' => 'required|string|max:1000',
            'subscribed_to_announcements' => 'required|boolean',
            'preferred_search_mode' => 'required|string|in:detailed,simple',
        ]);

        $request->user()->fill($validated);
        
        // If email changed, we might want to unverify it if we are using MustVerifyEmail,
        // but since we are not strictly currently using email verification logic, simply save.
        $request->user()->save();

        return back()->with('success', 'Settings updated successfully.');
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        \Illuminate\Support\Facades\Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
