
'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '../ui/button';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
    
    // Cleanup function
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleManualScan = () => {
    // This is a mock scan for demonstration purposes
    const mockBarcode = `1234567890${Math.floor(Math.random() * 9) + 1}`;
    toast({
        title: "Manual Scan Added",
        description: `Barcode: ${mockBarcode}`,
    })
    onScan(mockBarcode);
  }

  return (
    <div className="space-y-4">
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                    <CameraOff className="w-12 h-12 text-muted-foreground mb-2" />
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use the scanner.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
             {hasCameraPermission === true && (
                <div className="absolute bottom-2 left-2 right-2 h-1/2 border-2 border-dashed border-primary/50 rounded-lg" />
            )}
        </div>
         <Button onClick={handleManualScan} className="w-full" variant="outline">
            <Camera className="mr-2" /> Mock Scan
        </Button>
    </div>
  );
}
