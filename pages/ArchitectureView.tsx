import React from 'react';

const ArchitectureView = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">System Documentation</h1>
        <p className="text-stone-500 mb-8">Architecture, Schema, and API Design for CaféFlow.</p>

        {/* 1. Architecture */}
        <section className="mb-12">
          <h2 className="text-xl font-bold border-b border-stone-200 pb-2 mb-4">1. High-Level Architecture</h2>
          <div className="bg-stone-900 text-stone-100 p-6 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
{`
[Client Layer]                [Service Layer]               [Data Layer]
+------------------+          +-------------------+         +------------------+
|  React SPA       | <------> |  API Gateway      | <-----> |  Database        |
|  (Tailwind UI)   |          |  (Node/Express)   |         |  (MongoDB)       |
+------------------+          +-------------------+         +------------------+
        |                              |
        v                              v
+------------------+          +-------------------+
|  Local Storage   |          |  AI Service       |
|  (Caching)       |          |  (Gemini API)     |
+------------------+          +-------------------+
`}
          </div>
        </section>

        {/* 2. Database Schema */}
        <section className="mb-12">
          <h2 className="text-xl font-bold border-b border-stone-200 pb-2 mb-4">2. Database Schema</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-mono font-bold text-amber-700 mb-2">Users Collection</h3>
              <ul className="list-disc pl-5 text-stone-600 space-y-1 text-sm">
                <li><code className="bg-stone-100 px-1 rounded">_id</code> (ObjectId): Unique identifier</li>
                <li><code className="bg-stone-100 px-1 rounded">email</code> (String): Indexed, unique</li>
                <li><code className="bg-stone-100 px-1 rounded">password_hash</code> (String): Bcrypt hash</li>
                <li><code className="bg-stone-100 px-1 rounded">role</code> (String): "admin" | "customer"</li>
                <li><code className="bg-stone-100 px-1 rounded">wallet_balance</code> (Decimal): Current funds</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono font-bold text-amber-700 mb-2">Menu Collection</h3>
              <ul className="list-disc pl-5 text-stone-600 space-y-1 text-sm">
                <li><code className="bg-stone-100 px-1 rounded">_id</code> (ObjectId)</li>
                <li><code className="bg-stone-100 px-1 rounded">name</code> (String)</li>
                <li><code className="bg-stone-100 px-1 rounded">category</code> (String): "Drinks", "Snacks"...</li>
                <li><code className="bg-stone-100 px-1 rounded">price</code> (Decimal)</li>
                <li><code className="bg-stone-100 px-1 rounded">is_available</code> (Boolean)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono font-bold text-amber-700 mb-2">Transactions Collection</h3>
              <ul className="list-disc pl-5 text-stone-600 space-y-1 text-sm">
                <li><code className="bg-stone-100 px-1 rounded">_id</code> (ObjectId)</li>
                <li><code className="bg-stone-100 px-1 rounded">user_id</code> (Ref -> Users)</li>
                <li><code className="bg-stone-100 px-1 rounded">amount</code> (Decimal): Positive (Deposit) / Negative (Spend)</li>
                <li><code className="bg-stone-100 px-1 rounded">type</code> (String): "DEPOSIT", "PAYMENT"</li>
                <li><code className="bg-stone-100 px-1 rounded">timestamp</code> (DateTime)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. API Endpoints */}
        <section className="mb-12">
          <h2 className="text-xl font-bold border-b border-stone-200 pb-2 mb-4">3. API Specification</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase">
                <tr>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Endpoint</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-2 font-bold text-blue-600">GET</td>
                  <td className="px-4 py-2 font-mono">/api/menu</td>
                  <td className="px-4 py-2">Fetch all menu items</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-green-600">POST</td>
                  <td className="px-4 py-2 font-mono">/api/menu</td>
                  <td className="px-4 py-2">Create menu item (Admin)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-blue-600">GET</td>
                  <td className="px-4 py-2 font-mono">/api/wallet/balance</td>
                  <td className="px-4 py-2">Get current user balance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-green-600">POST</td>
                  <td className="px-4 py-2 font-mono">/api/wallet/topup</td>
                  <td className="px-4 py-2">Add funds to wallet</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-green-600">POST</td>
                  <td className="px-4 py-2 font-mono">/api/orders</td>
                  <td className="px-4 py-2">Create order & deduct balance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Intern Build Plan */}
        <section>
          <h2 className="text-xl font-bold border-b border-stone-200 pb-2 mb-4">4. Intern Build Plan</h2>
          <ol className="list-decimal pl-5 space-y-4 text-stone-600 text-sm">
            <li>
              <strong>Phase 1: Static UI (Day 1-2)</strong>
              <p>Build the Menu Grid and Navbar using Tailwind. Mock the data in a constant file.</p>
            </li>
            <li>
              <strong>Phase 2: State Management (Day 3-4)</strong>
              <p>Implement React Context for the Cart. Allow adding/removing items. Calculate totals.</p>
            </li>
            <li>
              <strong>Phase 3: Wallet Logic (Day 5)</strong>
              <p>Create the Wallet Context. Implement Top-Up logic. Block checkout if balance is low.</p>
            </li>
            <li>
              <strong>Phase 4: Admin & Refinement (Day 6-7)</strong>
              <p>Add the Admin Dashboard with a form to push new items to the Context state.</p>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default ArchitectureView;