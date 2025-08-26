import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, MinusCircle, Trash2, CreditCard } from 'lucide-react';
import type { CartItem, Product } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import ReceiptModal from './ReceiptModal';

interface CartProps {
  items: CartItem[];
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export default function Cart({ items, onAdd, onRemove, onClear }: CartProps) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePayment = () => {
    if (items.length > 0) {
      setIsReceiptModalOpen(true);
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Order</CardTitle>
          {items.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onClear} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear cart</span>
            </Button>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6 text-muted-foreground">
                <p>Add products to start a new order.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(item.id)}>
                        <MinusCircle className="h-5 w-5" />
                      </Button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdd(item)}>
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="w-16 text-right font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
        {items.length > 0 && (
          <CardFooter className="flex flex-col gap-4 p-4 mt-auto border-t">
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={handlePayment}>
              <CreditCard className="mr-2 h-5 w-5" />
              Process Payment
            </Button>
          </CardFooter>
        )}
      </Card>
      {isReceiptModalOpen && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            onClear();
          }}
          cartItems={items}
          total={total}
        />
      )}
    </>
  );
}
