export enum Category {
  DRINKS = 'Drinks',
  SNACKS = 'Snacks',
  COMBOS = 'Combos',
  SPECIALS = 'Specials',
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  calories?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO string
  description: string;
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  wallet: Wallet;
}

// For the AI Recommender
export interface AIRecommendation {
  message: string;
  recommendedItemIds: string[];
}