<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Speciality extends Model
{
    /** @use HasFactory<\Database\Factories\SpecialityFactory> */
    use HasFactory;

    protected $fillable = ['name', 'parent_id'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Speciality::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Speciality::class, 'parent_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function scopeCategories($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeSubcategories($query)
    {
        return $query->whereNotNull('parent_id');
    }
}
