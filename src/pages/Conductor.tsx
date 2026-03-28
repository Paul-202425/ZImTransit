import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Scan, Users, CheckCircle2, XCircle, Bus, MapPin, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Conductor() {
  const { cards, processFare, transactions } = useStore();
  const [selectedCardId, setSelectedCardId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'fail' | null>(null);

  const busNumber = "ZUPCO-HRE-102";
  const currentLocation = "Harare CBD";
  const routeId = '2';
  const fare = 1.50;

  const handleScan = () => {
    if (!selectedCardId) {
      toast.error('Select a card to simulate scan');
      return;
    }
    const card = cards.find((c) => c.id === selectedCardId);
    if (card?.status === 'blocked') {
      toast.error('This card is blocked. Send the commuter to a hub.');
      return;
    }

    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const success = processFare(selectedCardId, fare, busNumber, currentLocation, routeId);
      setScanning(false);
      if (success) {
        setScanResult('success');
        toast.success(`Fare $${fare.toFixed(2)} deducted successfully`);
        setTimeout(() => setScanResult(null), 3000);
      } else {
        setScanResult('fail');
        toast.error('Insufficient funds on card!');
        setTimeout(() => setScanResult(null), 3000);
      }
    }, 1500);
  };

  const todayStats = transactions.filter(
    (t) =>
      t.type === 'fare' &&
      t.busNumber === busNumber &&
      new Date(t.timestamp).toDateString() === new Date().toDateString()
  );

  const dailyRevenue = todayStats.reduce((sum, t) => sum + t.amount, 0);
  const dailyPassengers = todayStats.length;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Bus className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{busNumber}</h1>
            <p className="text-slate-500 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {currentLocation}
            </p>
          </div>
        </div>
      </header>

      {/* Simulator Control */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Scan className="w-5 h-5 text-orange-400" /> Card Scanner Sim
          </h3>
          
          <div className="space-y-4 mb-8">
            <label className="text-xs text-slate-400 uppercase font-bold">Select Active Card</label>
            <select 
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full bg-slate-800 border-0 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Choose Card to Scan --</option>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.holderName} ({c.id}) — ${c.balance.toFixed(2)}
                  {c.status === 'blocked' ? ' [BLOCKED]' : ''}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleScan}
            disabled={scanning || !selectedCardId}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-orange-500/20"
          >
            {scanning ? 'Reading NFC...' : 'Tap Card Now'}
          </button>
        </div>

        {/* Scan Feedback Overlay */}
        <AnimatePresence>
          {scanResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-inherit`}
            >
              {scanResult === 'success' ? (
                <>
                  <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-4" />
                  <p className="text-2xl font-bold">PAYMENT SUCCESS</p>
                  <p className="text-slate-400">Balance: ${cards.find(c => c.id === selectedCardId)?.balance.toFixed(2)}</p>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-red-400 mb-4" />
                  <p className="text-2xl font-bold">INSUFFICIENT FUNDS</p>
                  <p className="text-slate-400">Please visit a Top-up Hub</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning Animation */}
        {scanning && (
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-400 shadow-[0_0_10px_orange] animate-[scan_2s_infinite]" />
        )}
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Passengers</span>
          </div>
          <p className="text-2xl font-bold">{dailyPassengers}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">${dailyRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <h3 className="font-semibold mb-3 text-sm text-slate-600">Recent Onboardings</h3>
        <div className="space-y-3">
          {todayStats.slice(0, 5).map(t => (
            <div key={t.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
              <span className="font-medium">{t.cardId}</span>
              <span className="text-slate-500">{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="font-bold text-emerald-600">${t.amount.toFixed(2)}</span>
            </div>
          ))}
          {todayStats.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-4">No passengers yet today</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}