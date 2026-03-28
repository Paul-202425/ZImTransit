import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Smartphone, CreditCard, LayoutDashboard } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-white p-4 rounded-3xl mb-8">
        <Bus className="w-12 h-12 text-indigo-600" />
      </div>
      
      <h1 className="text-4xl font-black mb-4 tracking-tight">Smart Zimbabwe</h1>
      <p className="text-indigo-100 max-w-xs mb-12">The future of public transportation. Tap, go, and travel across the nation with ease.</p>
      
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-50 transition"
        >
          <Smartphone className="w-5 h-5" /> Passenger Entry
        </button>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/hub')}
            className="bg-indigo-700/50 border border-indigo-400/30 text-white font-bold py-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-indigo-700 transition"
          >
            <CreditCard className="w-5 h-5" /> Agent
          </button>
          <button 
            onClick={() => navigate('/conductor')}
            className="bg-indigo-700/50 border border-indigo-400/30 text-white font-bold py-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-indigo-700 transition"
          >
            <Bus className="w-5 h-5" /> Conductor
          </button>
          <button 
            onClick={() => navigate('/admin')}
            className="col-span-2 bg-indigo-700/50 border border-indigo-400/30 text-white font-bold py-4 rounded-2xl flex flex-row items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            <LayoutDashboard className="w-5 h-5" /> Admin dashboard
          </button>
        </div>
      </div>
      
      <p className="mt-12 text-indigo-300 text-[10px] uppercase font-bold tracking-[0.2em]">Developed for Zimbabwe Transit Authority</p>
    </div>
  );
}