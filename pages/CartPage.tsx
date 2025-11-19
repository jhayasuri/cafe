
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowRight, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, processPayment, user, menu } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const canAfford = user.wallet.balance >= total;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    
    const result = await processPayment();
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || 'Payment failed');
    }
    setIsProcessing(false);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Order Confirmed!</h1>
        <p className="text-stone-600 mb-8 max-w-md">Your order has been placed successfully. You can pick it up at the counter in approximately 10 minutes.</p>
        <Link to="/" className="bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800">
          Back to Menu
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mb-6">
          <ArrowRight size={32} />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h1>
        <p className="text-stone-600 mb-8">Looks like you haven't added any delicious items yet.</p>
        <Link to="/" className="bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Your Order</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const menuItem = menu.find(m => m.id === item.id);
            const currentStock = menuItem ? menuItem.stock : 0;
            const isStockIssue = currentStock < item.quantity;

            return (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-stone-100" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-stone-900">{item.name}</h3>
                    <p className="text-sm text-stone-500">{item.category}</p>
                    {isStockIssue && (
                       <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                         <AlertCircle size={12} /> Only {currentStock} available
                       </p>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-1">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white text-stone-600 shadow-sm hover:text-stone-900"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded bg-white text-stone-600 shadow-sm hover:text-stone-900 ${item.quantity >= currentStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={item.quantity >= currentStock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tax (8%)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-lg text-stone-900">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            {/* Wallet Check */}
            <div className={`p-4 rounded-lg mb-6 ${canAfford ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={16} className={canAfford ? 'text-green-600' : 'text-red-600'} />
                <span className={`text-sm font-medium ${canAfford ? 'text-green-800' : 'text-red-800'}`}>
                  Wallet Balance: ${user.wallet.balance.toFixed(2)}
                </span>
              </div>
              {!canAfford && (
                <p className="text-xs text-red-600 mt-1">
                  Insufficient funds. <Link to="/wallet" className="underline font-bold">Top up now</Link>
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!canAfford || isProcessing}
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
