<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookCategory;

class BookCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'علوم الحاسوب والمعلوماتية',
            'الهندسة الكهربائية والإلكترونية',
            'الهندسة الميكانيكية',
            'الهندسة المدنية والمعمارية',
            'الطاقة والطاقات المتجددة',
            'الطب والعلوم الصحية التطبيقية',
            'العلوم الصناعية والتصنيع',
            'علوم البيانات والأنظمة الذكية',
            'الاتصالات وتقنيات الإنترنت',
            'علوم البيئة والتقنيات الزراعية',
            'علوم المواد والكيمياء التطبيقية',
            'هندسة النقل والفضاء'
        ];

        foreach ($categories as $name) {
            BookCategory::firstOrCreate(['name' => $name, 'parent_id' => null]);
        }
    }
}
