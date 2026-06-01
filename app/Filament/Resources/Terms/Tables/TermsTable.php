<?php

namespace App\Filament\Resources\Terms\Tables;

use App\Actions\ImportCsvAction;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Http\UploadedFile;

class TermsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("resource_page_id")->numeric()->sortable(),
                TextColumn::make("term_en")->searchable(),
                TextColumn::make("term_ar")->searchable(),
                TextColumn::make("created_at")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make("updated_at")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make("x")->numeric()->sortable(),
                TextColumn::make("y")->numeric()->sortable(),
                TextColumn::make("width")->numeric()->sortable(),
                TextColumn::make("height")->numeric()->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make("extraction_tool")
                    ->label("Extraction Tool")
                    ->badge()
                    ->sortable()
                    ->searchable()
                    ->toggleable(),
                TextColumn::make("status")->badge()->color(
                    fn(string $state): string => match ($state) {
                        "unverified" => "warning",
                        "accepted" => "success",
                        "rejected" => "danger",
                        default => "gray",
                    },
                ),
                TextColumn::make("rejection_reason")
                    ->limit(50)
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make("corrections")
                    ->limit(50)
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label("Corrections"),
            ])
            ->filters([
                SelectFilter::make('extraction_tool')
                    ->label('Extraction Tool')
                    ->options([
                        'google_vision' => 'Google Vision',
                        'flash-lite' => 'Gemini Flash Lite',
                        'gemini' => 'Gemini',
                    ]),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    \Filament\Actions\BulkAction::make('generateBook')
                        ->label('Generate Book from Selection')
                        ->icon('heroicon-o-book-open')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            \App\Jobs\GenerateBookJob::dispatch(
                                termIds: $records->pluck('id')->toArray(),
                                mode: 'manual',
                                user: auth()->user()
                            );

                            \Filament\Notifications\Notification::make()
                                ->title('Book generation started')
                                ->body('You will be notified when the book is ready.')
                                ->success()
                                ->send();
                        })
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->headerActions([
                Action::make("importCsv")
                    ->label("Import CSV")
                    ->icon("heroicon-o-arrow-up-tray")
                    ->color("success")
                    ->form([
                        FileUpload::make("csv_file")
                            ->label("CSV File")
                            ->acceptedFileTypes(["text/csv", "text/plain"])
                            ->maxSize(10240)
                            ->required()
                            ->helperText(
                                "Upload a CSV file with columns: term_en, term_ar (required)",
                            ),
                        Toggle::make("skip_duplicates")
                            ->label("Skip Duplicate Terms")
                            ->default(true)
                            ->helperText(
                                "Skip terms that already exist in the database",
                            ),
                    ])
                    ->action(function (array $data): void {
                        $file = $data["csv_file"] ?? null;

                        if (!$file || !($file instanceof UploadedFile)) {
                            Notification::make()
                                ->title("Import Failed")
                                ->body("No CSV file uploaded")
                                ->danger()
                                ->send();
                            return;
                        }

                        try {
                            $options = [
                                "skip_duplicates" =>
                                    $data["skip_duplicates"] ?? true,
                                "auto_save" => true,
                            ];

                            $csvAction = new ImportCsvAction();
                            $result = $csvAction->execute($file, $options);

                            if ($result["has_errors"]) {
                                Notification::make()
                                    ->title("Import Completed with Errors")
                                    ->body(
                                        "Imported: {$result["imported"]}, Skipped: {$result["skipped"]}, Total: {$result["total_rows"]}",
                                    )
                                    ->danger()
                                    ->send();
                            } else {
                                Notification::make()
                                    ->title("Import Successful")
                                    ->body(
                                        "Successfully imported {$result["imported"]} terms. Skipped {$result["skipped"]} duplicates/errors.",
                                    )
                                    ->success()
                                    ->send();
                            }
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title("Import Failed")
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    }),
                Action::make("goToImportPage")
                    ->label("Advanced Import")
                    ->icon("heroicon-o-globe-alt")
                    ->color("primary")
                    ->url(route("filament.admin.pages.import-terms"))
                    ->openUrlInNewTab(),
            ]);
    }
}
