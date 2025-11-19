import React, { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, History } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TransactionType } from '../types';

const WalletPage = () => {
  const { user, walletTopUp } = useStore();
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  
  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      walletTopUp(amount);
      setTopUpAmount('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Digital Wallet</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CreditCard size={120} />
          </div>
          <p className="text-stone-300 mb-1">Current Balance</p>
          <div className="text-4xl font-bold mb-6 tracking-tight">${user.wallet.balance.toFixed(2)}</div>
          
          <div className="flex items-center gap-4 text-sm text-stone-300">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Active
            </div>
            <div>{user.name}</div>
          </div>
        </div>

        {/* Add Money */}
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-stone-800 flex items-center gap-2">
            <DollarSign className="text-amber-600" /> Add Funds
          </h3>
          <form onSubmit={handleTopUp}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
                <input 
                  type="number"
                  min="1"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-lg font-medium"
                />
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              {[10, 20, 50].map(amt => (
                <button 
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt.toString())}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 rounded text-stone-600 font-medium text-sm transition-colors"
                >
                  +${amt}
                </button>
              ))}
            </div>
            <button 
              type="submit"
              disabled={!topUpAmount}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              Top Up Wallet
            </button>
          </form>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center gap-2 bg-stone-50">
          <History size={18} className="text-stone-500" />
          <h3 className="font-semibold text-stone-800">Transaction History</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {user.wallet.transactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === TransactionType.DEPOSIT ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-600'
                }`}>
                  {tx.type === TransactionType.DEPOSIT ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div>
                  <p className="font-medium text-stone-900">{tx.description}</p>
                  <p className="text-xs text-stone-500">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}</p>
                </div>
              </div>
              <span className={`font-bold ${
                tx.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-stone-900'
              }`}>
                {tx.type === TransactionType.DEPOSIT ? '+' : ''}{tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
          
          {user.wallet.transactions.length === 0 && (
            <div className="p-8 text-center text-stone-500">No transactions yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;