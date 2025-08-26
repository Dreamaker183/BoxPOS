import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Mail, MessageSquare } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { generateReceipt } from '@/ai/flows/generate-receipt';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
}

export default function ReceiptModal({ isOpen, onClose, cartItems, total }: ReceiptModalProps) {
  const [receiptContent, setReceiptContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const generate = async () => {
        setIsLoading(true);
        setError('');
        try {
          const transactionData = {
            items: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
            total: total.toFixed(2),
            date: new Date().toISOString(),
          };

          const brandingPreferences = {
            logoUrl: 'https://example.com/logo.png',
            brandColors: { primary: '#64B5F6', accent: '#FFB74D' },
            font: 'Inter',
          };
          
          const result = await generateReceipt({
            transactionData: JSON.stringify(transactionData),
            brandingPreferences: JSON.stringify(brandingPreferences),
            customerContact: 'customer@example.com',
            receiptFormat: 'email',
          });

          if (result && result.receiptContent) {
            setReceiptContent(result.receiptContent);
          } else {
            throw new Error('Failed to generate receipt content.');
          }
        } catch (e) {
          console.error(e);
          setError('Could not generate receipt. Please try again.');
          toast({
            title: 'Error',
            description: 'Failed to generate receipt.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      generate();
    }
  }, [isOpen, cartItems, total, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Complete</DialogTitle>
          <DialogDescription>Receipt generated successfully.</DialogDescription>
        </DialogHeader>
        <div className="my-4 min-h-[300px] border rounded-lg p-2 bg-muted/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
                <Alert variant="destructive">
                    <AlertTitle>Generation Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
          ) : (
            <iframe
              srcDoc={receiptContent}
              className="w-full h-[300px] border-0"
              title="Receipt"
            />
          )}
        </div>
        <DialogFooter className="sm:justify-start gap-2">
          <Button type="button" size="lg" disabled={isLoading || !!error}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button type="button" variant="secondary" size="lg" disabled={isLoading || !!error}>
            <Mail className="mr-2 h-4 w-4" /> Email
          </Button>
          <Button type="button" variant="secondary" size="lg" disabled={isLoading || !!error}>
            <MessageSquare className="mr-2 h-4 w-4" /> SMS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
