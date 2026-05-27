<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create the pivot table
        Schema::create('book_book_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_category_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        // 2. Migrate existing data
        $books = \Illuminate\Support\Facades\DB::table('books')->whereNotNull('book_category_id')->get();
        foreach ($books as $book) {
            \Illuminate\Support\Facades\DB::table('book_book_category')->insert([
                'book_id' => $book->id,
                'book_category_id' => $book->book_category_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Drop the old column
        Schema::table('books', function (Blueprint $table) {
            $table->dropForeign(['book_category_id']);
            $table->dropColumn('book_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Add back the column
        Schema::table('books', function (Blueprint $table) {
            $table->foreignId('book_category_id')->nullable()->constrained('book_categories')->nullOnDelete()->after('author');
        });

        // 2. Migrate data back (only taking the first category for each book)
        $pivots = \Illuminate\Support\Facades\DB::table('book_book_category')->get()->groupBy('book_id');
        foreach ($pivots as $book_id => $group) {
            \Illuminate\Support\Facades\DB::table('books')->where('id', $book_id)->update([
                'book_category_id' => $group->first()->book_category_id
            ]);
        }

        // 3. Drop the pivot table
        Schema::dropIfExists('book_book_category');
    }
};
