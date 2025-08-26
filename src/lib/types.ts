export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  'data-ai-hint'?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
