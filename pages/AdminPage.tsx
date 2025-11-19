
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { Edit, Trash, Plus, X, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, MenuItem } from '../types';

const AdminPage = () => {
  const { menu, orders, addMenuItem, deleteMenuItem } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '', description: '', price: 0, category: Category.DRINKS, image: 'https://picsum.photos/400/400', available: true, stock: 20
  });

  // Calculate Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  
  // Prepare Chart Data
  const salesData = orders.slice(0, 7).map((order, idx) => ({
    name: `Order ${idx + 1}`,
    amount: order.total
  }));

  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    count: menu.filter(m => m.category === cat).length
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    addMenuItem({
      id: Date.now().toString(),
      name: newItem.name!,
      description: newItem.description || '',
      price: Number(newItem.price),
      category: newItem.category as Category,
      image: newItem.image || 'https://picsum.photos/400/400',
      available: true,
      stock: Number(newItem.stock) || 0
    } as MenuItem);
    
    setIsModalOpen(false);
    setNewItem({ name: '', description: '', price: 0, category: Category.DRINKS, image: 'https://picsum.photos/400/400', available: true, stock: 20 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-800"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <p className="text-stone-500 text-sm uppercase font-bold">Total Revenue</p>
          <p className="text-3xl font-bold text-amber-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <p className="text-stone-500 text-sm uppercase font-bold">Total Orders</p>
          <p className="text-3xl font-bold text-stone-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <p className="text-stone-500 text-sm uppercase font-bold">Menu Items</p>
          <p className="text-3xl font-bold text-stone-900">{menu.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="font-bold mb-4">Recent Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#d97706" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="font-bold mb-4">Menu Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip cursor={{fill: '#f5f5f4'}} />
                <Bar dataKey="count" fill="#44403c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 font-bold text-stone-700">
          Menu Inventory
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {menu.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-stone-200" />
                      <span className="font-medium text-stone-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{item.category}</td>
                  <td className="px-6 py-4 font-mono">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 font-mono">
                    <div className={`flex items-center gap-1 ${item.stock < 5 ? 'text-red-600 font-bold' : 'text-stone-600'}`}>
                      <Package size={14} />
                      {item.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteMenuItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Menu Item</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-stone-400 hover:text-stone-600" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input 
                  required 
                  className="w-full border border-stone-300 rounded-lg p-2"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-stone-300 rounded-lg p-2"
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full border border-stone-300 rounded-lg p-2"
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stock Qty</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border border-stone-300 rounded-lg p-2"
                    value={newItem.stock}
                    onChange={e => setNewItem({...newItem, stock: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select 
                  className="w-full border border-stone-300 rounded-lg p-2"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value as Category})}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 mt-2">
                Create Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
