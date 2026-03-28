import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Store, UserPlus, CreditCard, Ticket as TicketIcon, Search, History } from 'lucide-react';
import { toast } from 'sonner';

export default function HubAgent() {
  const { cards, addCard, topUpCard, routes, sellTicket, transactions } = useStore();
  const [searchId, setSearchId] = useState('');
  const [newName, setNewName] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('5');

  const query = searchId.trim().toLowerCase();
  const foundCard = query
    ? cards.find(
        (c) =>
          c.id.toLowerCase() === query ||
          c.id.toLowerCase().includes(query) ||
          c.holderName.toLowerCase().includes(query)
      )
    : undefined;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const card = addCard(newName);
    setNewName('');
    setSearchId(card.id);
    toast.success(`Card ${card.id} registered to ${newName}`);
  };

  const handleTopUp = () => {
    if (!foundCard) {
      toast.error('Find a card first before topping up.');
      return;
    }
    const amt = parseFloat(topUpAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error('Enter a valid top-up amount.');
      return;
    }
    topUpCard(foundCard.id, amt);
    toast.success(`Added $${amt.toFixed(2)} to ${foundCard.holderName}'s card`);
  };

  const handleSellTicket = (routeId: string) => {
    sellTicket(routeId);
    toast.success('Physical ticket sold successfully');
  };

  const hubTransactions = transactions.filter(t => t.location === 'Hub Station' || t.location === 'Hub Terminal').slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Terminal Hub Agent</h1>
        </div>
        <p className="text-slate-500">Service Point: Harare Central Station</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Registration & Search */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-indigo-600" /> New Registration
            </h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input 
                type="text" 
                placeholder="Commuter Name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500"
              />
              <button className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700">
                Issue Smart Card
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-indigo-600" /> Find Card
            </h3>
            <input 
              type="text" 
              placeholder="Search ID or Name" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 mb-4"
            />
            {!query && (
              <p className="text-xs text-slate-400 mb-2">Enter a card ID or commuter name to look up a card.</p>
            )}
            {query && !foundCard && (
              <p className="text-sm text-amber-600 font-medium">No card matches that search.</p>
            )}
            {foundCard && (
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Card Found</p>
                <p className="font-bold">{foundCard.holderName}</p>
                <p className="text-sm text-slate-500">{foundCard.id}</p>
                <p className="text-lg font-bold text-indigo-600 mt-2">${foundCard.balance.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Operations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Card Top-up
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['2', '5', '10', '20', '50'].map(amt => (
                <button 
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-lg font-medium border ${topUpAmount === amt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button 
              onClick={handleTopUp}
              disabled={!foundCard}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50"
            >
              Process Top-up for {foundCard ? foundCard.holderName : '...'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-6">
              <TicketIcon className="w-5 h-5 text-indigo-600" /> Quick Ticket Sales
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {routes.map(route => (
                <button 
                  key={route.id}
                  onClick={() => handleSellTicket(route.id)}
                  className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 text-left transition"
                >
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">{route.name}</p>
                  <p className="font-bold text-lg">${route.fare.toFixed(2)}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Buy Now</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-600" /> Recent Sales
            </h3>
            <div className="space-y-3">
              {hubTransactions.map(t => (
                <div key={t.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mr-2 ${t.type === 'topup' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {t.type}
                    </span>
                    <span className="text-slate-600">{t.cardId === 'CASH-PASSENGER' ? 'Cash Ticket' : t.cardId}</span>
                  </div>
                  <span className="font-bold">${t.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}