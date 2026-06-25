import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { BookOpen, GraduationCap, Home, Menu, X, Phone, Sparkles } from 'lucide-react';

interface PublicNavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ activeTab, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { id: 'find-tutors', label: 'Tìm gia sư', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'register-tutor', label: 'Đăng ký dạy', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header
      id="public-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/80'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/25 text-sm">
              TĐ
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                Gia Sư Thành Đạt
              </span>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.12em] leading-none mt-0.5">
                Uy tín hàng đầu Hà Nội
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:0000000000" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Phone className="w-3 h-3" />
              <span>Hotline tư vấn</span>
            </a>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quản trị</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setIsMobileOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === link.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={() => { onNavigate('dashboard'); setIsMobileOpen(false); }}
                className="w-full px-4 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center gap-2 justify-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Quản trị viên</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
