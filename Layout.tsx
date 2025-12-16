import React, { useState } from 'react';
import { 
  Activity, 
  MessageSquare, 
  User as UserIcon, 
  RefreshCw, 
  Menu, 
  X,
  HeartHandshake,
  BookOpen
} from 'lucide-react';
import { User } from 'firebase/auth';
import { ViewState } from '../types';
import { CREATOR_INFO } from '../constants';

interface LayoutProps {
  user: User;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, currentView, setView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-all duration-200 group ${
        currentView === view 
          ? 'bg-teal-50 text-teal-700 shadow-sm font-medium' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      <Icon size={20} className={`mr-3 ${currentView === view ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span>{label}</span>
    </button>
  );

  const handleReset = () => {
    // Since it's a guest session, we just reload the page to reset state
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-full shadow-lg z-10">
        <div className="p-6 border-b border-slate-100 flex items-center">
          <div className="bg-teal-600 p-2 rounded-lg mr-3 shadow-lg shadow-teal-200">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">BioNurse Pro</h1>
            <p className="text-xs text-slate-400 font-medium">Medical AI Assistant</p>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
            <NavItem view={ViewState.DASHBOARD} icon={Activity} label="Dashboard" />
            <NavItem view={ViewState.CHAT} icon={MessageSquare} label="AI Consultation" />
            <NavItem view={ViewState.LEARNING} icon={BookOpen} label="Learning Center" />
            <NavItem view={ViewState.PROFILE} icon={UserIcon} label="My Profile" />
            <NavItem view={ViewState.DONATE} icon={HeartHandshake} label="Support & Premium" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
           <div className="flex items-center mb-4 px-2">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'Guest'}&background=0d9488&color=fff`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-700 truncate">{user.displayName || 'Guest User'}</p>
                <p className="text-xs text-slate-500 truncate">{user.email || 'Free Access'}</p>
              </div>
           </div>
           <button 
            onClick={handleReset}
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
           >
             <RefreshCw size={16} className="mr-2" />
             Reset App
           </button>
           <div className="mt-4 text-center">
             <p className="text-[10px] text-slate-400">Created by {CREATOR_INFO.name}</p>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="bg-teal-600 p-1.5 rounded-md mr-2">
            <Activity className="text-white" size={20} />
          </div>
          <span className="font-bold text-slate-800">BioNurse Pro</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-4">
           <NavItem view={ViewState.DASHBOARD} icon={Activity} label="Dashboard" />
           <NavItem view={ViewState.CHAT} icon={MessageSquare} label="AI Consultation" />
           <NavItem view={ViewState.LEARNING} icon={BookOpen} label="Learning Center" />
           <NavItem view={ViewState.PROFILE} icon={UserIcon} label="My Profile" />
           <NavItem view={ViewState.DONATE} icon={HeartHandshake} label="Support & Premium" />
           <div className="mt-8 border-t border-slate-100 pt-6">
             <button onClick={handleReset} className="flex items-center w-full text-slate-600 p-2">
                <RefreshCw size={20} className="mr-3" />
                Reset App
             </button>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden md:relative pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;