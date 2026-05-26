<?php

namespace App\Filament\Resources\BookCategoryResource\Pages;

use App\Filament\Resources\BookCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageBookCategories extends ManageRecords
{
    protected static string $resource = BookCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
