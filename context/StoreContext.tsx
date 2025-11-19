
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MenuItem, CartItem, Transaction, TransactionType, Order } from '../types';
import { MOCK_MENU, INITIAL_USER } from '../constants';

interface PaymentResult {
  success: boolean;
  message: string;
}

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
  processPayment: () => Promise<PaymentResult>;
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
    if (item.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        // Check stock limit
        if (existing.quantity >= item.stock) return prev;
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
    
    const item = menu.find(m => m.id === itemId);
    if (item && quantity > item.stock) return; // Prevent adding more than stock

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

  const processPayment = async (): Promise<PaymentResult> => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (user.wallet.balance < total) {
      return { success: false, message: 'Insufficient funds. Please top up your wallet.' };
    }

    // Validate Stock one last time
    for (const cartItem of cart) {
      const menuItem = menu.find(m => m.id === cartItem.id);
      if (!menuItem) return { success: false, message: `Item ${cartItem.name} no longer exists.` };
      if (menuItem.stock < cartItem.quantity) {
        return { success: false, message: `Not enough stock for ${cartItem.name}. Available: ${menuItem.stock}` };
      }
    }

    // Deduct Stock
    const newMenu = menu.map(m => {
      const cartItem = cart.find(c => c.id === m.id);
      if (cartItem) {
        return { ...m, stock: m.stock - cartItem.quantity };
      }
      return m;
    });
    setMenu(newMenu);

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
    return { success: true, message: 'Payment successful!' };
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
