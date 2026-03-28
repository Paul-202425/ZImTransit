import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CreditCard, History, Plus, Smartphone, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const DEFAULT_TAP_ROUTE_ID = '1';

export default function Passenger() {
  const { cards, addCard, topUpCard, transactions, processFare, routes } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [isTapping, setIsTapping] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (cards.length === 0) {
      setSelectedCardId(null);
      return;
    }
    setSelectedCardId((prev) =>
      prev && cards.some((c) => c.id === prev) ? prev : cards[cards.length - 1].id
    );
  }, [cards]);

  const currentCard = selectedCardId ? cards.find((c) => c.id === selectedCardId) : undefined;
  const tapRoute = routes.find((r) => r.id === DEFAULT_TAP_ROUTE_ID);
  const tapFare = tapRoute?.fare ?? 2.5;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const card = addCard(name);
    toast.success(`Card ${card.id} created successfully!`);
    setIsRegistering(false);
    setName('');
  };

  const handleTopUp = (amount: number) => {
    if (!currentCard) return;
    if (!Number.isFinite(amount) || amount <= 0) return;
    topUpCard(currentCard.id, amount);
    toast.success(`$${amount.toFixed(2)} added to card ${currentCard.id}`);
  };

  const simulateTap = () => {
    if (!currentCard) return;
    if (currentCard.status === 'blocked') {
      toast.error('This card is blocked. Visit a hub for assistance.');
      return;
    }
    if (currentCard.balance < tapFare) {
      toast.error(`Need at least $${tapFare.toFixed(2)} for this trip. Please top up.`);
      return;
    }

    setIsTapping(true);
    setTimeout(() => {
      const success = processFare(
        currentCard.id,
        tapFare,
        'ZUPCO-88',
        tapRoute?.name ?? 'Chitungwiza Road',
        DEFAULT_TAP_ROUTE_ID
      );
      if (success) {
        toast.success('Payment successful. Travel safe.');
      } else {
        toast.error('Payment could not be completed.');
      }
      setIsTapping(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Travel</h1>
          <p className="text-slate-500 text-sm">Zimbabwe Smart Bus System</p>
        </div>
        <div className="bg-indigo-100 p-2 rounded-full">
          <Smartphone className="w-6 h-6 text-indigo-600" />
        </div>
      </header>

      {!currentCard ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center"
        >
          <Plus className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No Travel Card Found</h3>
          <p className="text-slate-500 text-sm mb-6">Register your digital card to start using the smart ticketing system.</p>
          <button 
            onClick={() => setIsRegistering(true)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Create Digital Card
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {cards.length > 1 && (
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Active card
              </label>
              <select
                value={selectedCardId ?? ''}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-800"
              >
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.holderName} · {c.id} · ${c.balance.toFixed(2)}
                    {c.status === 'blocked' ? ' (blocked)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Virtual Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`relative h-48 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden ${currentCard.status === 'blocked' ? 'opacity-90 ring-4 ring-red-400/50' : ''}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Go Zimbabwe</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                {currentCard.status === 'blocked' && (
                  <span className="text-[10px] font-bold uppercase bg-red-500/90 px-2 py-0.5 rounded">Blocked</span>
                )}
                <div className="text-xs opacity-80 uppercase tracking-widest">Digital Card</div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs opacity-70 mb-1 uppercase tracking-wider">Current Balance</p>
              <h2 className="text-3xl font-bold">${currentCard.balance.toFixed(2)}</h2>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] opacity-70 uppercase">Card Holder</p>
                <p className="font-medium text-sm">{currentCard.holderName}</p>
              </div>
              <p className="font-mono text-sm tracking-widest">{currentCard.id}</p>
            </div>
          </motion.div>

          <p className="text-center text-xs text-slate-500">
            Simulated tap: {tapRoute?.name ?? 'Default route'} · ${tapFare.toFixed(2)}
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleTopUp(amt)}
                  disabled={currentCard.status === 'blocked'}
                  className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-medium border border-emerald-100 disabled:opacity-40"
                >
                  <DollarSign className="w-3.5 h-3.5" /> {amt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => simulateTap()}
              disabled={isTapping || currentCard.status === 'blocked'}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4" /> Tap to Pay
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
              <History className="w-4 h-4" /> Recent Trips
            </h3>
            <div className="space-y-4">
              {transactions.filter(t => t.cardId === currentCard.id).slice(0, 5).map((t) => {
                const label =
                  t.type === 'topup' ? 'Top Up' : t.type === 'ticket' ? 'Cash Ticket' : 'Bus Fare';
                const isCredit = t.type === 'topup';
                return (
                <div key={t.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-slate-800">{label}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(t.timestamp).toLocaleString()}
                      {t.busNumber ? ` · ${t.busNumber}` : ''}
                    </p>
                  </div>
                  <p className={`font-semibold ${isCredit ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {isCredit ? '+' : '-'}${t.amount.toFixed(2)}
                  </p>
                </div>
              );})}
              {transactions.filter(t => t.cardId === currentCard.id).length === 0 && (
                <p className="text-center text-slate-400 text-xs py-4">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tap Animation Overlay */}
      <AnimatePresence>
        {isTapping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-full flex items-center justify-center relative">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 border-4 border-indigo-400 rounded-full"
              />
              <Smartphone className="w-16 h-16 text-indigo-600 animate-pulse" />
            </div>
            <p className="absolute bottom-20 text-white font-medium text-lg">Scanning Card...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegistering && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">Register New Card</h2>
              <form onSubmit={handleCreate}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tendai Moyo"
                      className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="flex-1 bg-slate-100 py-3 rounded-xl font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium"
                    >
                      Create Card
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}