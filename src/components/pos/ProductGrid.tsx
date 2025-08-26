
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScanLine } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export default function ProductGrid({ products, onAddToCart, searchTerm, onSearchTermChange }: ProductGridProps) {
  return (
    <div className="flex flex-col h-full rounded-lg bg-card text-card-foreground shadow-lg">
      <div className="p-4 border-b">
        <div className="relative">
          <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Scan barcode or search products..." 
            className="pl-10 text-base"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
              onClick={() => onAddToCart(product)}
            >
              <CardContent className="p-0 flex flex-col items-center text-center">
                <div className="relative w-full aspect-square">
                   <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                    data-ai-hint={product['data-ai-hint']}
                  />
                </div>
                <div className="p-3 w-full">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
