import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Bus, Store, ShieldCheck, Home } from 'lucide-react';

export function Navigation() {
  const links = [
    { to: '/', icon: User, label: 'Passenger' },
    { to: '/conductor', icon: Bus, label: 'Conductor' },
    { to: '/hub', icon: Store, label: 'Hub Agent' },
    { to: '/admin', icon: ShieldCheck, label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-1 md:py-3 lg:static lg:border-t-0 lg:border-r lg:h-screen lg:w-64 lg:p-6 lg:bg-slate-50">
      <div className="hidden lg:flex items-center gap-3 mb-12">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Bus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">ZimTransit</h2>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Digital Proto</p>
        </div>
      </div>

      <div className="flex justify-around items-center lg:flex-col lg:items-stretch lg:gap-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-4 py-2 lg:py-3 rounded-xl transition-all
              ${isActive 
                ? 'text-indigo-600 lg:bg-indigo-600 lg:text-white shadow-md lg:shadow-indigo-200' 
                : 'text-slate-400 hover:text-slate-600 lg:hover:bg-slate-100'}
            `}
          >
            <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
            <span className="text-[10px] lg:text-sm font-bold tracking-tight">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}