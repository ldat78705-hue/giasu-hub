import React, { useState } from 'react';
import { ActiveTab, AdminRole, ADMIN_ROLE_CONFIG } from '../types';
import { LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign, ClipboardList, Settings, ExternalLink, UserPlus, MessageCircle, Calendar, Star, ClipboardCheck, BarChart3, Upload, FileText, Wrench, Award, Activity, Bell, Menu, X, Globe } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingClassesCount: number;
  pendingApplicationsCount: number;
  unreadContactsCount?: number;
  pendingRegistrationsCount?: number;
  activeMatchesCount?: number;
  adminRole?: AdminRole;
}

interface NavItem { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingClassesCount, pendingApplicationsCount, unreadContactsCount = 0, pendingRegistrationsCount = 0, activeMatchesCount = 0, adminRole }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole = adminRole || 'super_admin';
  const allowedTabs = ADMIN_ROLE_CONFIG[currentRole]?.tabs || [];

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: 'classes', label: 'Quản lý lớp', icon: <BookOpen className="w-[18px] h-[18px]" />, badge: pendingClassesCount },
    { id: 'matches', label: 'Ghép lớp', icon: <ExternalLink className="w-[18px] h-[18px]" />, badge: activeMatchesCount },
    { id: 'tutors', label: 'Gia sư', icon: <GraduationCap className="w-[18px] h-[18px]" /> },
    { id: 'students', label: 'Học viên', icon: <Users className="w-[18px] h-[18px]" /> },
  ];

  const navItems2: NavItem[] = [
    { id: 'registrations', label: 'Đăng ký học', icon: <UserPlus className="w-[18px] h-[18px]" />, badge: pendingRegistrationsCount },
    { id: 'contacts', label: 'Liên hệ', icon: <MessageCircle className="w-[18px] h-[18px]" />, badge: unreadContactsCount },
    { id: 'zalonotify', label: 'Tin nhắn Zalo', icon: <Bell className="w-[18px] h-[18px]" /> },
  ];

  const navItems3: NavItem[] = [
    { id: 'performance', label: 'Hiệu suất gia sư', icon: <Award className="w-[18px] h-[18px]" /> },
    { id: 'kpi', label: 'Thống kê', icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    { id: 'reviews', label: 'Đánh giá', icon: <Star className="w-[18px] h-[18px]" /> },
  ];

  const navItems4: NavItem[] = [
    { id: 'activity', label: 'Hoạt động', icon: <Activity className="w-[18px] h-[18px]" /> },
    { id: 'import', label: 'Nhập dữ liệu', icon: <Upload className="w-[18px] h-[18px]" /> },
    { id: 'advanced', label: 'Nâng cao', icon: <Wrench className="w-[18px] h-[18px]" /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const totalBadge = pendingClassesCount + pendingApplicationsCount + unreadContactsCount + pendingRegistrationsCount;

  const renderItem = (item: NavItem) => {
    if (!allowedTabs.includes(item.id)) return null;
    const active = activeTab === item.id;
    return (
      <button key={item.id}
        onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer transition-all rounded-xl text-[13px] ${
          active ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
        }`}>
        <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] text-center rounded-full ${
            active ? 'bg-white/25 text-white' : 'bg-red-500/90 text-white'
          }`}>{item.badge}</span>
        )}
      </button>
    );
  };

  const renderSection = (items: NavItem[]) => {
    const filtered = items.filter(i => allowedTabs.includes(i.id));
    if (filtered.length === 0) return null;
    return <div className="space-y-0.5">{filtered.map(renderItem)}</div>;
  };

  const content = (
    <>
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-bold text-white leading-tight">Gia Sư Thành Đạt</div>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto p-1 text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-4" style={{ scrollbarWidth: 'none' }}>
        {renderSection(navItems)}
        <div className="border-t border-white/[0.08] pt-3">{renderSection(navItems2)}</div>
        <div className="border-t border-white/[0.08] pt-3">{renderSection(navItems3)}</div>
        <div className="border-t border-white/[0.08] pt-3">{renderSection(navItems4)}</div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <button onClick={() => { window.open('/', '_blank'); setMobileOpen(false); }}
          className="w-full px-3 py-2.5 text-[13px] text-slate-400 hover:text-white cursor-pointer transition-colors flex items-center gap-2 rounded-xl hover:bg-white/[0.07]">
          <ExternalLink className="w-4 h-4" /> Trang công khai
        </button>
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-[#1a1a2e] text-white rounded-xl cursor-pointer shadow-lg">
        <Menu className="w-5 h-5" />
        {totalBadge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">{totalBadge > 9 ? '9+' : totalBadge}</span>}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}

      <aside className="hidden lg:flex w-[220px] bg-[#1a1a2e] text-slate-300 flex-col h-full shrink-0">
        {content}
      </aside>

      <aside className={`lg:hidden fixed top-0 left-0 z-50 w-[260px] bg-[#1a1a2e] text-slate-300 flex flex-col h-full transition-transform duration-200 shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {content}
      </aside>
    </>
  );
};
