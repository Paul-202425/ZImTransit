import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import Passenger from './pages/Passenger';
import Conductor from './pages/Conductor';
import HubAgent from './pages/HubAgent';
import Admin from './pages/Admin';
import Auth from './pages/Auth';

function LayoutWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 lg:pb-0 ${isAuthPage ? 'pb-0' : ''}`}>
      {!isAuthPage && <Navigation />}
      <main className="flex-1 w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Passenger />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/conductor" element={<Conductor />} />
          <Route path="/hub" element={<HubAgent />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;