import React, { useState } from 'react';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { getRecommendation } from '../services/geminiService';
import { useStore } from '../context/StoreContext';

const AIBarista = () => {
  const { menu, addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ message: string, items: string[] } | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    
    setLoading(true);
    setResponse(null);
    
    const result = await getRecommendation(mood, menu);
    
    setResponse({
      message: result.recommendation,
      items: result.suggestedItemNames || []
    });
    setLoading(false);
  };

  const handleAddSuggested = (name: string) => {
    const item = menu.find(m => m.name === name);
    if (item) {
      addToCart(item);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-4 z-40 bg-gradient-to-r from-amber-600 to-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
      >
        <Sparkles size={20} />
        <span className="hidden md:inline font-medium">AI Barista</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <h3 className="font-semibold">AI Barista</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 bg-stone-50 min-h-[200px] max-h-[400px] overflow-y-auto">
        {!response && !loading && (
          <p className="text-stone-600 text-sm">
            Hi there! Tell me how you're feeling (e.g., "Sleepy need energy", "Cold day comfort"), and I'll pick the perfect drink for you.
          </p>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        )}

        {response && (
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
              <p className="text-stone-800 text-sm">{response.message}</p>
            </div>
            
            {response.items.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase">Recommended Items</p>
                {response.items.map((itemName, idx) => {
                   const item = menu.find(m => m.name === itemName);
                   if(!item) return null;
                   return (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-stone-200">
                      <span className="text-sm font-medium truncate">{itemName}</span>
                      <button 
                        onClick={() => handleAddSuggested(itemName)}
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200"
                      >
                        Add +
                      </button>
                    </div>
                   )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="p-3 border-t border-stone-200 bg-white flex gap-2">
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling?"
          className="flex-1 text-sm border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 px-3 py-2 border"
        />
        <button 
          type="submit" 
          disabled={loading || !mood.trim()}
          className="bg-stone-900 text-white p-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
        >
          <MessageCircle size={18} />
        </button>
      </form>
    </div>
  );
};

export default AIBarista;