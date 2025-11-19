import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Wallet, ShoppingBag, Settings, LayoutGrid, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
  const { cart, user, isAdmin, toggleRole } = useStore();
  const location = useLocation();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path 
    ? "text-stone-900 bg-stone-200" 
    : "text-stone-500 hover:text-stone-700 hover:bg-stone-100";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center text-white">
              <Coffee size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-stone-800">CaféFlow</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>
              Menu
            </Link>
            <Link to="/wallet" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/wallet')}`}>
              Wallet
            </Link>
            <Link to="/system-design" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/system-design')}`}>
              <div className="flex items-center gap-1"><FileText size={14}/> System Docs</div>
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Role Toggle (For Demo Purposes) */}
            <button 
              onClick={toggleRole}
              className="hidden lg:flex text-xs px-2 py-1 border border-stone-300 rounded text-stone-500 hover:bg-stone-50"
            >
              {isAdmin ? 'Switch to Customer' : 'Switch to Admin'}
            </button>

            {/* Wallet Balance Preview */}
            <Link to="/wallet" className="hidden sm:flex flex-col items-end text-right leading-none">
              <span className="text-[10px] text-stone-500 uppercase font-semibold">Balance</span>
              <span className="text-sm font-bold text-stone-800">${user.wallet.balance.toFixed(2)}</span>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-amber-700 transition-colors">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 flex justify-around py-3 z-50 pb-safe">
        <Link to="/" className="flex flex-col items-center text-stone-500">
          <LayoutGrid size={20} />
          <span className="text-[10px] mt-1">Menu</span>
        </Link>
        <Link to="/wallet" className="flex flex-col items-center text-stone-500">
          <Wallet size={20} />
          <span className="text-[10px] mt-1">Wallet</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-stone-500 relative">
          <ShoppingBag size={20} />
          {totalItems > 0 && <div className="absolute top-0 right-2 w-2 h-2 bg-amber-600 rounded-full"></div>}
          <span className="text-[10px] mt-1">Cart</span>
        </Link>
        <Link to="/system-design" className="flex flex-col items-center text-stone-500">
          <Settings size={20} />
          <span className="text-[10px] mt-1">Docs</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;