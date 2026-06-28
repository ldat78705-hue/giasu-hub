import React, { useState } from 'react';
import { ActiveTab, AdminRole, ADMIN_ROLE_CONFIG } from '../types';
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign,
  Settings, ExternalLink, UserPlus, MessageCircle, Star,
  BarChart3, Upload, Wrench, Award, Activity, Bell, Menu, X,
  TrendingUp, FileText, Sun, Moon
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingClassesCount: number;
  pendingApplicationsCount: number;
  unreadContactsCount?: number;
  pendingRegistrationsCount?: number;
  activeMatchesCount?: number;
  adminRole?: AdminRole;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

interface NavItem { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, pendingClassesCount, pendingApplicationsCount,
  unreadContactsCount = 0, pendingRegistrationsCount = 0, activeMatchesCount = 0,
  adminRole, isDark = false, onToggleTheme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentRole = adminRole || 'super_admin';
  const allowedTabs = ADMIN_ROLE_CONFIG[currentRole]?.tabs || [];

  const allItems: NavItem[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard /> },
    { id: 'classes', label: 'Quản lý lớp', icon: <BookOpen />, badge: pendingClassesCount },
    { id: 'matches', label: 'Ghép lớp', icon: <TrendingUp />, badge: activeMatchesCount },
    { id: 'tutors', label: 'Gia sư', icon: <GraduationCap /> },
    { id: 'students', label: 'Học viên', icon: <Users /> },
    { id: 'registrations', label: 'Đăng ký học', icon: <UserPlus />, badge: pendingRegistrationsCount },
    { id: 'contacts', label: 'Liên hệ', icon: <MessageCircle />, badge: unreadContactsCount },
    { id: 'zalonotify', label: 'Tin nhắn Zalo', icon: <Bell /> },
    { id: 'performance', label: 'Hiệu suất gia sư', icon: <Award /> },
    { id: 'kpi', label: 'Thống kê', icon: <BarChart3 /> },
    { id: 'reviews', label: 'Đánh giá', icon: <Star /> },
    { id: 'finance', label: 'Tài chính', icon: <DollarSign /> },
    { id: 'activity', label: 'Hoạt động', icon: <Activity /> },
    { id: 'import', label: 'Nhập dữ liệu', icon: <Upload /> },
    { id: 'blog', label: 'Blog & SEO', icon: <FileText /> },
    { id: 'advanced', label: 'Nâng cao', icon: <Wrench /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings /> },
  ];

  const visibleItems = allItems.filter(i => allowedTabs.includes(i.id));

  // Theme colors
  const bg = isDark ? '#1a1f2e' : '#ffffff';
  const borderC = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const textColor = isDark ? '#e2e8f0' : '#334155';
  const mutedColor = isDark ? '#64748b' : '#94a3b8';
  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';

  const renderItem = (item: NavItem) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '10px 16px',
          margin: '0 12px',
          maxWidth: 'calc(100% - 24px)',
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: isActive ? 600 : 500,
          textAlign: 'left',
          transition: 'all 0.15s',
          background: isActive ? '#4f46e5' : 'transparent',
          color: isActive ? '#fff' : textColor,
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#fff' : mutedColor }}>
          {React.cloneElement(item.icon as React.ReactElement, { style: { width: 20, height: 20 } })}
        </span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.label}
        </span>
        {item.badge !== undefined && item.badge > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            padding: '1px 6px', minWidth: 20, textAlign: 'center',
            borderRadius: 999, flexShrink: 0,
            background: isActive ? 'rgba(255,255,255,0.3)' : '#fee2e2',
            color: isActive ? '#fff' : '#dc2626',
          }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px', borderBottom: `1px solid ${borderC}`, display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 4,
          background: '#4f46e5', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>
          GS
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#fff' : '#1e293b', lineHeight: 1.3 }}>Gia Sư Thành Đạt</div>
          <div style={{ fontSize: 11, color: mutedColor, fontWeight: 500 }}>Quản trị hệ thống</div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          style={{ display: 'none', position: 'absolute', top: 18, right: 16, background: 'none', border: 'none', color: mutedColor, cursor: 'pointer' }}
          className="lg:hidden"
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 12, paddingBottom: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleItems.map(renderItem)}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: `1px solid ${borderC}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: '10px 16px',
              borderRadius: 4, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, textAlign: 'left',
              background: 'transparent', color: textColor,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {isDark ? <Sun style={{ width: 18, height: 18, color: '#fbbf24' }} /> : <Moon style={{ width: 18, height: 18, color: '#94a3b8' }} />}
            <span>{isDark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
          </button>
        )}
        <button
          onClick={() => { window.open('/', '_blank'); setMobileOpen(false); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '10px 16px',
            borderRadius: 4, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, textAlign: 'left',
            background: 'transparent', color: mutedColor,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <ExternalLink style={{ width: 18, height: 18 }} />
          <span>Xem trang công khai</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: 260, flexShrink: 0, height: '100%',
        borderRight: `1px solid ${borderC}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {sidebarContent}
      </aside>
    </>
  );
};
