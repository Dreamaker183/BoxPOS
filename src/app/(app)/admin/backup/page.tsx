
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { CloudUpload, History, Settings } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const mockBackups = [
  { id: 'backup-1', date: '2024-08-01 02:00:00 UTC', size: '256 MB' },
  { id: 'backup-2', date: '2024-07-31 02:00:00 UTC', size: '254 MB' },
  { id: 'backup-3', date: '2024-07-30 02:00:00 UTC', size: '255 MB' },
];

export default function BackupRestorePage() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast({
            title: 'Backup Complete',
            description: 'A new manual backup has been successfully created.',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestore = (backupId: string) => {
    toast({
      title: 'Restore Initiated',
      description: `Restoring from backup ${backupId}. This is a dummy action.`,
    });
  };

  return (
    <div className="space-y-6">
       <header>
        <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">Manage your system's data backups and restore points.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Manual Controls</CardTitle>
          <CardDescription>Trigger manual backups or configure automated backup schedules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={handleManualBackup} disabled={isBackingUp}>
              <CloudUpload className="mr-2" />
              {isBackingUp ? 'Backing up...' : 'Manual Backup'}
            </Button>
            <Button size="lg" variant="outline">
              <Settings className="mr-2" />
              Schedule Settings
            </Button>
          </div>
          {isBackingUp && (
            <div className="space-y-2 pt-2">
              <Label>Backup Progress</Label>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <History />
              Recent Backups
            </div>
          </CardTitle>
          <CardDescription>Here is a list of your most recent data backups.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBackups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.date}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleRestore(backup.id)}>
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
