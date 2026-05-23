import React, { useState } from 'react';
import { Menu, X, Hotel, User, LogOut, LayoutDashboard, PhoneCall } from 'lucide-react';
import { UserProfile } from '../types';

const LogoImage = "/src/assets/images/gurukrupa_logo_1779473752353.png";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  siteName: string;
  phone: string;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  onOpenAuth,
  siteName,
  phone
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Rooms', id: 'rooms' },
    { label: 'Services', id: 'services' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-amber-500/20 backdrop-blur-md bg-opacity-95 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative group p-0.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/10">
              <img 
                src={LogoImage} 
                alt="Gurukrupa Lodging Logo" 
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full border border-slate-900 bg-white group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif tracking-wide text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent block -mb-0.5">
                {siteName}
              </span>
              <p className="text-[9px] text-amber-500/80 tracking-widest uppercase font-mono">Home Away From Home</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  currentTab === item.id
                    ? 'text-amber-400 bg-amber-500/10 border-b-2 border-amber-500 rounded-b-none'
                    : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Controls & Call Action */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={`tel:${phone}`} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 text-xs font-mono text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
            >
              <PhoneCall className="h-3 w-3" />
              <span>Call Reception</span>
            </a>

            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
                <button
                  onClick={() => handleNavClick(user.role === 'admin' ? 'admin' : 'dashboard')}
                  className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium max-w-[110px] truncate">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      Admin
                    </span>
                  )}
                </button>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1 px-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all duration-300 transform active:scale-95 shadow-md shadow-amber-500/10"
              >
                <User className="h-4 w-4" />
                <span>Guest Login / Register</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger menu key */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <button
                onClick={() => handleNavClick(user.role === 'admin' ? 'admin' : 'dashboard')}
                className="p-1.5 text-amber-400 bg-amber-500/10 rounded-lg hover:bg-amber-500/20"
              >
                <LayoutDashboard className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6 text-amber-500" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-b border-amber-500/10 shadow-inner px-2 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 text-base font-semibold rounded-lg transition-all ${
                currentTab === item.id
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-300 hover:text-amber-400 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-800/80 my-3 pt-3 px-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-200 text-sm font-medium">{user.name} ({user.email})</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick(user.role === 'admin' ? 'admin' : 'dashboard')}
                    className="w-full text-center py-2 bg-slate-800 text-amber-400 rounded-lg text-sm font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2 bg-red-950/40 text-red-400 rounded-lg text-sm font-medium border border-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3 rounded-lg text-sm shadow-md"
              >
                <User className="h-4 w-4" />
                <span>Guest Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
