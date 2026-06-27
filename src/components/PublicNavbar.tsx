import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Home, Search, GraduationCap, UserPlus, Phone, Menu, X, MessageCircle } from 'lucide-react';

interface PublicNavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  zaloNumber?: string;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ activeTab, onNavigate, zaloNumber }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'find-tutors', label: 'Tìm gia sư' },
    { id: 'register-tutor', label: 'Đăng ký dạy' },
    { id: 'status-lookup', label: 'Tra cứu' },
    { id: 'tutor-portal', label: 'Cổng GS' },
  ];

  const mobileItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Home size={20} /> },
    { id: 'find-tutors', label: 'Gia sư', icon: <Search size={20} /> },
    { id: 'parent-register', label: 'Đăng ký', icon: <UserPlus size={20} /> },
    { id: 'register-tutor', label: 'Dạy kèm', icon: <GraduationCap size={20} /> },
  ];

  return (
    <>
      {/* Top bar */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: '#fff',
          borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
          transition: 'border-color .2s, box-shadow .2s',
        }}
      >
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => onNavigate('home')}>
            <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>TĐ</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Gia Sư Thành Đạt</span>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="lg:flex hidden">
            {links.map(l => (
              <button key={l.id} onClick={() => onNavigate(l.id)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  background: activeTab === l.id ? '#eff6ff' : 'transparent',
                  color: activeTab === l.id ? '#2563eb' : '#475569',
                  border: 'none', transition: 'all .15s',
                }}>
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="lg:flex hidden">
            {zaloNumber && (
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={14} color="#2563eb" />{zaloNumber}
              </span>
            )}
            <button onClick={() => onNavigate('parent-register')}
              style={{ padding: '7px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Tìm gia sư
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer', color: '#475569' }}
            className="lg:hidden">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '8px 16px 12px' }} className="lg:hidden">
            {links.map(l => (
              <button key={l.id} onClick={() => { onNavigate(l.id); setMobileOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                  fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', marginBottom: 2,
                  background: activeTab === l.id ? '#eff6ff' : 'transparent',
                  color: activeTab === l.id ? '#2563eb' : '#475569',
                }}>
                {l.label}
              </button>
            ))}
            <button onClick={() => { onNavigate('parent-register'); setMobileOpen(false); }}
              style={{ display: 'block', width: '100%', padding: '10px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8, textAlign: 'center' }}>
              Tìm gia sư ngay
            </button>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,.97)', borderTop: '1px solid #e2e8f0', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 4px 2px' }}>
          {mobileItems.map(item => (
            <button key={item.id} onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, padding: '4px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === item.id ? '#2563eb' : '#94a3b8',
              }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
