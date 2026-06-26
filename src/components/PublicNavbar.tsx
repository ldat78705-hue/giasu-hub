import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Home, Search, GraduationCap, UserPlus, Phone, Menu, X } from 'lucide-react';

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
    { id: 'find-tutors' as ActiveTab, label: 'Tìm GS', icon: <Search className="w-5 h-5" /> },
    { id: 'parent-register' as ActiveTab, label: 'Đăng ký', icon: <UserPlus className="w-5 h-5" /> },
    { id: 'register-tutor' as ActiveTab, label: 'Dạy kèm', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-shadow duration-200 ${
        isScrolled ? 'shadow-sm border-slate-200' : 'border-slate-100'
      }`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">TĐ</div>
              <span className="text-sm sm:text-base font-bold text-slate-900">Gia Sư Thành Đạt</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === link.id ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}>
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-2">
              {zaloNumber && (
                <a href={`tel:${zaloNumber}`} className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />{zaloNumber}
                </a>
              )}
              <button onClick={() => onNavigate('dashboard')}
                className="ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-md cursor-pointer hover:bg-slate-800 transition-colors">
                Quản trị
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-slate-600 cursor-pointer">
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="px-5 py-3 space-y-1">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => { onNavigate(link.id); setIsMobileOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                    activeTab === link.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                  {link.label}
                </button>
              ))}
              <button onClick={() => { onNavigate('dashboard'); setIsMobileOpen(false); }}
                className="w-full mt-2 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg cursor-pointer">
                Quản trị
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav lg:hidden">
        <div className="flex items-stretch justify-around px-1 pt-1 pb-0.5">
          {mobileNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); setIsMobileOpen(false); }}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 cursor-pointer transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}>
                {item.icon}
                <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
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
