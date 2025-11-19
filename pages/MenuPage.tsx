
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import AIBarista from '../components/AIBarista';

const MenuPage = () => {
  const { menu, addToCart, cart } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menu, searchTerm, selectedCategory]);

  const getCartQuantity = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-10">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Fresh Brews & Bites</h1>
          <p className="text-stone-400">Order your favorites or try something new today.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', ...Object.values(Category)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as Category | 'All')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-100 border-transparent focus:bg-white border focus:border-stone-300 rounded-lg text-sm transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map((item) => {
            const cartQty = getCartQuantity(item.id);
            const isSoldOut = item.stock <= 0;
            const isLowStock = item.stock > 0 && item.stock < 5;
            const canAdd = item.stock > cartQty;

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-all">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-sm px-3 py-1 border border-white rounded">SOLD OUT</span>
                    </div>
                  )}
                  {!isSoldOut && isLowStock && (
                     <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1">
                       <AlertCircle size={12} /> Only {item.stock} left
                     </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900">{item.name}</h3>
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                    </div>
                    <span className="font-bold text-amber-700">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-stone-500 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
                  
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.available || isSoldOut || !canAdd}
                    className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-2.5 rounded-lg font-medium hover:bg-stone-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                    {canAdd ? 'Add to Order' : 'Max Limit Reached'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-stone-100 rounded-full mb-4">
              <Filter size={32} className="text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900">No items found</h3>
            <p className="text-stone-500">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
      
      <AIBarista />
    </div>
  );
};

export default MenuPage;
