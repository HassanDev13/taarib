<?php

namespace App\Filament\Resources\Resources\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ResourcesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('path')
                    ->searchable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'processing' => 'warning',
                        'done' => 'success',
                        'error' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('verification_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'unverified' => 'warning',
                        'accepted' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('rejection_reason')
                    ->limit(50)
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\Action::make('view_terms')
                    ->label('View Terms')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => route('filament.admin.resources.terms.index', ['tableFilters[resource][value]' => $record->id])),
                \Filament\Actions\Action::make('clean_text')
                    ->label('Clean Text & GPT')
                    ->icon('heroicon-o-sparkles')
                    ->color('primary')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('start_page')
                            ->label('Start Page')
                            ->numeric()
                            ->required()
                            ->default(1),
                        \Filament\Forms\Components\TextInput::make('end_page')
                            ->label('End Page')
                            ->numeric()
                            ->required()
                            ->default(fn ($record) => $record->pages()->count()),
                    ])
                    ->action(function ($record, array $data) {
                        $startPage = $data['start_page'];
                        $endPage = $data['end_page'];
                        
                        if ($endPage < $startPage) {
                            \Filament\Notifications\Notification::make()
                                ->title('Error')
                                ->body('End page must be greater than or equal to start page.')
                                ->danger()
                                ->send();
                            return;
                        }

                        $pages = $record->pages()
                            ->whereBetween('page_number', [$startPage, $endPage])
                            ->get();

                        if ($pages->isEmpty()) {
                            \Filament\Notifications\Notification::make()
                                ->title('Error')
                                ->body('No pages found in the specified range.')
                                ->danger()
                                ->send();
                            return;
                        }

                        foreach ($pages as $page) {
                            \App\Jobs\ProcessPageForGPTJob::dispatch($page);
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('Cleaning started')
                            ->body("Queued {$pages->count()} pages for processing.")
                            ->success()
                            ->send();
                    }),
                \Filament\Actions\Action::make('regenerate_ocr')
                    ->label('Regenerate OCR (Google Vision)')
                    ->icon('heroicon-o-camera')
                    ->color('warning')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('start_page')
                            ->label('Start Page')
                            ->numeric()
                            ->required()
                            ->default(1),
                        \Filament\Forms\Components\TextInput::make('end_page')
                            ->label('End Page')
                            ->numeric()
                            ->required()
                            ->default(fn ($record) => $record->pages()->count()),
                    ])
                    ->action(function ($record, array $data) {
                        $startPage = $data['start_page'];
                        $endPage = $data['end_page'];
                        
                        if ($endPage < $startPage) {
                            \Filament\Notifications\Notification::make()
                                ->title('Error')
                                ->body('End page must be greater than or equal to start page.')
                                ->danger()
                                ->send();
                            return;
                        }

                        $pages = $record->pages()
                            ->whereBetween('page_number', [$startPage, $endPage])
                            ->get();

                        if ($pages->isEmpty()) {
                            \Filament\Notifications\Notification::make()
                                ->title('Error')
                                ->body('No pages found in the specified range.')
                                ->danger()
                                ->send();
                            return;
                        }

                        foreach ($pages as $page) {
                            if ($page->image_path) {
                                \App\Jobs\ProcessPageJob::dispatch($page);
                            }
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('OCR Regeneration started')
                            ->body("Queued {$pages->count()} pages for Google Vision OCR.")
                            ->success()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    \Filament\Actions\BulkAction::make('process_upload')
                        ->label('Start Upload Processing')
                        ->icon('heroicon-o-arrow-path')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            foreach ($records as $record) {
                                \App\Jobs\ProcessResourceJob::dispatch($record);
                            }
                            \Filament\Notifications\Notification::make()
                                ->title('Processing started')
                                ->success()
                                ->send();
                        }),
                    \Filament\Actions\BulkAction::make('generate_gpt')
                        ->label('Start GPT Generation')
                        ->icon('heroicon-o-sparkles')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            foreach ($records as $record) {
                                foreach ($record->pages as $page) {
                                    \App\Jobs\ProcessPageForGPTJob::dispatch($page);
                                }
                            }
                            \Filament\Notifications\Notification::make()
                                ->title('GPT generation started')
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }
}
