import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Home, Search, GraduationCap, UserPlus, Phone, Menu, X, Settings } from 'lucide-react';

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

  const navLinks = [
    { id: 'home' as ActiveTab, label: 'Trang chủ' },
    { id: 'find-tutors' as ActiveTab, label: 'Tìm gia sư' },
    { id: 'parent-register' as ActiveTab, label: 'Đăng ký học' },
    { id: 'register-tutor' as ActiveTab, label: 'Đăng ký dạy' },
  ];

  const mobileNav = [
    { id: 'home' as ActiveTab, label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
    { id: 'find-tutors' as ActiveTab, label: 'Tìm gia sư', icon: <Search className="w-5 h-5" /> },
    { id: 'parent-register' as ActiveTab, label: 'Đăng ký học', icon: <UserPlus className="w-5 h-5" /> },
    { id: 'register-tutor' as ActiveTab, label: 'Đăng ký dạy', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md shadow-slate-200/50 border-b border-slate-100' : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-md shadow-blue-600/20">
                TĐ
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                  Gia Sư Thành Đạt
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-blue-600 uppercase tracking-[0.1em] leading-none mt-0.5">
                  Tri thức hôm nay, thành công ngày mai
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => onNavigate(link.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === link.id
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}>
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-2.5">
              {zaloNumber && (
                <a href={`tel:${zaloNumber}`}
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>{zaloNumber}</span>
                </a>
              )}
              <button onClick={() => onNavigate('register-tutor')}
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-lg cursor-pointer transition-colors">
                Gia sư đăng ký
              </button>
              <button onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg cursor-pointer transition-colors shadow-sm">
                Đăng nhập
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer">
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
            <div className="px-5 py-4 space-y-2">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => { onNavigate(link.id); setIsMobileOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab === link.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button onClick={() => { onNavigate('register-tutor'); setIsMobileOpen(false); }}
                  className="flex-1 py-3 border border-blue-600 text-blue-600 text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />GS đăng ký
                </button>
                <button onClick={() => { onNavigate('dashboard'); setIsMobileOpen(false); }}
                  className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
                  <Settings className="w-4 h-4" />Quản trị
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav lg:hidden">
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
