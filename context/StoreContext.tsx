import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MenuItem, CartItem, Transaction, TransactionType, Order } from '../types';
import { MOCK_MENU, INITIAL_USER } from '../constants';

interface StoreContextType {
  user: User;
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  toggleRole: () => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  walletTopUp: (amount: number) => void;
  processPayment: () => Promise<boolean>;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize state from LocalStorage if available, else default
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('cafe_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cafe_menu');
    return saved ? JSON.parse(saved) : MOCK_MENU;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cafe_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  // Persistence effects
  useEffect(() => { localStorage.setItem('cafe_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('cafe_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('cafe_orders', JSON.stringify(orders)); }, [orders]);

  const isAdmin = user.role === 'admin';

  const toggleRole = () => {
    setUser(prev => ({ ...prev, role: prev.role === 'admin' ? 'customer' : 'admin' }));
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const walletTopUp = (amount: number) => {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: TransactionType.DEPOSIT,
      amount,
      date: new Date().toISOString(),
      description: 'Wallet Top-up'
    };
    
    setUser(prev => ({
      ...prev,
      wallet: {
        balance: prev.wallet.balance + amount,
        transactions: [newTransaction, ...prev.wallet.transactions]
      }
    }));
  };

  const processPayment = async (): Promise<boolean> => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (user.wallet.balance < total) return false;

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: TransactionType.PAYMENT,
      amount: -total,
      date: new Date().toISOString(),
      description: `Order Payment (${cart.length} items)`
    };

    // Update User Wallet
    setUser(prev => ({
      ...prev,
      wallet: {
        balance: prev.wallet.balance - total,
        transactions: [newTransaction, ...prev.wallet.transactions]
      }
    }));

    // Create Order Record
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      items: [...cart],
      total,
      date: new Date().toISOString(),
      status: 'completed'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return true;
  };

  // Admin CRUD
  const addMenuItem = (item: MenuItem) => setMenu(prev => [...prev, item]);
  
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenu(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteMenuItem = (id: string) => {
    setMenu(prev => prev.filter(item => item.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      user, menu, cart, orders, isAdmin, toggleRole,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      walletTopUp, processPayment,
      addMenuItem, updateMenuItem, deleteMenuItem
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};