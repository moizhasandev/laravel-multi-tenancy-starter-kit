import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Phone, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'DNC Scrub',
        href: '/scrub',
    },
];

export default function ScrubPage() {
    const [file, setFile] = useState<File | null>(null);
    const [numbers, setNumbers] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<{
        total?: number;
        dnc_matches?: number;
        clean?: number;
        details?: Array<{ number: string; is_dnc: boolean }>;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleNumbersChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNumbers(event.target.value);
        setError(null);
    };

    const scrubFile = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResults(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // TODO: Replace with actual Blacklist Alliance API endpoint
            const response = await fetch('/api/scrub/file', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to scrub file');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    const scrubNumbers = async () => {
        if (!numbers.trim()) {
            setError('Please enter phone numbers to scrub');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResults(null);

        try {
            const phoneNumbers = numbers
                .split('\n')
                .map(num => num.trim())
                .filter(num => num.length > 0);

            // TODO: Replace with actual Blacklist Alliance API endpoint
            const response = await fetch('/api/scrub/numbers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numbers: phoneNumbers }),
            });

            if (!response.ok) {
                throw new Error('Failed to scrub numbers');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DNC Scrub - Blacklist Alliance" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">DNC Scrub</h1>
                        <p className="text-muted-foreground">
                            Scrub phone numbers against Do Not Call (DNC) lists via Blacklist Alliance
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Upload File for DNC Scrubbing
                            </CardTitle>
                            <CardDescription>
                                Upload a CSV or Excel file containing phone numbers to scrub against DNC lists.
                                Supported formats: CSV, XLSX, XLS
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">Select File</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="cursor-pointer"
                                />
                                {file && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                    </div>
                                )}
                            </div>
                            
                            <Button 
                                onClick={scrubFile} 
                                disabled={!file || isProcessing}
                                className="w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Scrub File
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Manual Number Input
                            </CardTitle>
                            <CardDescription>
                                Enter phone numbers manually (one per line) to scrub against DNC lists.
                                Supports multiple formats: 1234567890, (123) 456-7890, +1-123-456-7890
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone-numbers">Phone Numbers</Label>
                                <textarea
                                    id="phone-numbers"
                                    placeholder="Enter phone numbers, one per line:&#10;1234567890&#10;(123) 456-7890&#10;+1-123-456-7890"
                                    value={numbers}
                                    onChange={handleNumbersChange}
                                    rows={8}
                                    className="font-mono flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div className="text-sm text-muted-foreground">
                                    {numbers.split('\n').filter(num => num.trim().length > 0).length} number(s) entered
                                </div>
                            </div>
                            
                            <Button 
                                onClick={scrubNumbers} 
                                disabled={!numbers.trim() || isProcessing}
                                className="w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Scrub Numbers
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {results && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Scrubbing Results</CardTitle>
                            <CardDescription>
                                Analysis results from Blacklist Alliance DNC check
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm font-medium">Total Numbers</span>
                                        <Badge variant="secondary">{results.total || 0}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm font-medium">DNC Matches</span>
                                        <Badge variant="destructive">{results.dnc_matches || 0}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="text-sm font-medium">Clean Numbers</span>
                                        <Badge variant="default">{results.clean || 0}</Badge>
                                    </div>
                                </div>
                                
                                {results.details && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Detailed Results</h4>
                                        <div className="max-h-64 overflow-y-auto space-y-1">
                                            {results.details.map((detail, index: number) => (
                                                <div key={index} className="flex items-center justify-between p-2 rounded border text-sm">
                                                    <span className="font-mono">{detail.number}</span>
                                                    <Badge variant={detail.is_dnc ? "destructive" : "default"}>
                                                        {detail.is_dnc ? "DNC" : "Clean"}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
