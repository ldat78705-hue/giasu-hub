import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Home, Search, GraduationCap, UserPlus, Phone, Menu, X, Sparkles } from 'lucide-react';

interface PublicNavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  zaloNumber?: string;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ activeTab, onNavigate, zaloNumber }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const mobileNav = [
    { id: 'home' as ActiveTab, label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
    { id: 'find-tutors' as ActiveTab, label: 'Tìm gia sư', icon: <Search className="w-5 h-5" /> },
    { id: 'parent-register' as ActiveTab, label: 'Đăng ký học', icon: <UserPlus className="w-5 h-5" /> },
    { id: 'register-tutor' as ActiveTab, label: 'Đăng ký dạy', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* === TOP NAVBAR (Desktop + Mobile) === */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/80' : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
      }`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/25 text-xs sm:text-sm">
                TĐ
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                  Gia Sư Thành Đạt
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-blue-600 uppercase tracking-[0.1em] leading-none mt-0.5">
                  Uy tín hàng đầu Hà Nội
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'home' as ActiveTab, label: 'Trang chủ' },
                { id: 'find-tutors' as ActiveTab, label: 'Tìm gia sư' },
                { id: 'parent-register' as ActiveTab, label: 'Đăng ký học' },
                { id: 'register-tutor' as ActiveTab, label: 'Đăng ký dạy' },
              ].map((link) => (
                <button key={link.id} onClick={() => onNavigate(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === link.id ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}>
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              {zaloNumber && (
                <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Zalo tư vấn</span>
                </a>
              )}
              <button onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quản trị</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer">
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              <button onClick={() => { onNavigate('dashboard'); setIsMobileOpen(false); }}
                className="w-full px-4 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center gap-2 justify-center cursor-pointer mt-2">
                <Sparkles className="w-4 h-4 text-amber-400" /><span>Quản trị viên</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* === MOBILE BOTTOM NAV === */}
      <nav className="mobile-bottom-nav md:hidden">
        <div className="flex items-stretch justify-around px-2 pt-1.5 pb-1">
          {mobileNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); setIsMobileOpen(false); }}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}>
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
