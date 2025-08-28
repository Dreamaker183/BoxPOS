
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

// Merchant models
export type MerchantType = 'franchise' | 'rent';

// Basic settlement record to support both models
export interface SettlementRecord {
  id: string;
  period: string; // YYYY-MM
  merchantType: MerchantType;
  orders: number;
  revenue: number; // gross revenue for the period
  fees: number; // processing/platform fees
  // Location context
  shop?: string;
  shelf?: string;
  // Franchise-specific
  royaltyRate?: number; // e.g. 0.08 for 8%
  // Rent-specific
  rentAmount?: number; // fixed rent for the period
  rentFee?: number; // alias for UI if needed
  depositFee?: number; // deposit delta (+ refund to merchant/tenant)
  // Derived
  payout: number;
  status: 'paid' | 'processing' | 'pending';
}
