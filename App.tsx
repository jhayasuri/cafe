import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import WalletPage from './pages/WalletPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import ArchitectureView from './pages/ArchitectureView';

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/system-design" element={<ArchitectureView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;