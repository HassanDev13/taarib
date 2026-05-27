<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'parent_id'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(BookCategory::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(BookCategory::class, 'parent_id');
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'book_category_id');
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
