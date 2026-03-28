import React from 'react';
import { useStore } from '../store/useStore';
import { LayoutDashboard, Users, CreditCard, Banknote, Map, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function Admin() {
  const { cards, transactions, getTotalRevenue, getTotalPassengers, routes } = useStore();

  const revenue = getTotalRevenue();
  const passengers = getTotalPassengers();
  const topups = transactions.filter(t => t.type === 'topup').reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, icon: Banknote, color: 'bg-emerald-500', trend: '+12%' },
    { label: 'Total Passengers', value: passengers, icon: Users, color: 'bg-blue-500', trend: '+5%' },
    { label: 'Active Cards', value: cards.length, icon: CreditCard, color: 'bg-indigo-500', trend: '+24%' },
    { label: 'Total Top-ups', value: `$${topups.toFixed(2)}`, icon: ArrowUpRight, color: 'bg-purple-500', trend: '+8%' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" /> Analytics Dashboard
          </h1>
          <p className="text-slate-500">Monitoring Zimbabwe's Transit Network</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Network Status
          </div>
        </div>
      </header>

      {/* Primary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> System Log
            </h3>
            <button className="text-indigo-600 text-sm font-bold">Export Data</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {transactions.slice(0, 10).map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs">{t.id.substring(0, 12)}...</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        t.type === 'fare' ? 'bg-blue-100 text-blue-600' :
                        t.type === 'topup' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">${t.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {t.location || t.busNumber || '—'}
                      {t.routeId && routes.find((r) => r.id === t.routeId) && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {routes.find((r) => r.id === t.routeId)?.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Complete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <LayoutDashboard className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No activity recorded in the system yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Route Performance */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-600" /> Route Performance
            </h3>
            <div className="space-y-6">
              {routes.map(route => {
                const count = transactions.filter(
                  (t) =>
                    (t.type === 'fare' || t.type === 'ticket') && t.routeId === route.id
                ).length;
                const percentage = passengers > 0 ? (count / passengers) * 100 : 0;
                
                return (
                  <div key={route.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">{route.name}</span>
                      <span className="font-bold text-slate-900">{count} px</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${Math.max(5, percentage)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Weekly Target</p>
              <h4 className="text-2xl font-bold mb-4">78% Achieved</h4>
              <div className="w-full h-1 bg-white/20 rounded-full mb-2">
                <div className="w-[78%] h-1 bg-white rounded-full" />
              </div>
              <p className="text-[10px] text-indigo-300">Target: $50,000.00 Gross Revenue</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  );
}