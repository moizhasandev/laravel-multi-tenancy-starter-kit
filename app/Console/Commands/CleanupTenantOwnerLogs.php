<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class CleanupTenantOwnerLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logs:cleanup-tenant-owner {--days=7 : Number of days to keep logs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old tenant owner creation logs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);
        $logPath = storage_path('logs');
        $deletedCount = 0;

        $this->info("Cleaning up tenant owner logs older than {$days} days...");

        // Get all tenant-owner log files
        $logFiles = File::glob($logPath . '/tenant-owner-*.log');

        foreach ($logFiles as $logFile) {
            $fileDate = Carbon::createFromTimestamp(File::lastModified($logFile));
            
            if ($fileDate->lt($cutoffDate)) {
                File::delete($logFile);
                $deletedCount++;
                $this->line("Deleted: " . basename($logFile));
            }
        }

        $this->info("Cleanup completed! Deleted {$deletedCount} log files.");
        
        return 0;
    }
}
