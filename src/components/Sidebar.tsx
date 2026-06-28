import React, { useState } from 'react';
import { ActiveTab, AdminRole, ADMIN_ROLE_CONFIG } from '../types';
import { LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign, ClipboardList, Settings, ExternalLink, Globe, UserPlus, MessageCircle, Calendar, Star, ClipboardCheck, BarChart3, Upload, FileText, Wrench, Award, Activity, Bell, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

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

interface NavGroup {
  label: string;
  items: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingClassesCount, pendingApplicationsCount, unreadContactsCount = 0, pendingRegistrationsCount = 0, activeMatchesCount = 0, adminRole }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole = adminRole || 'super_admin';
  const allowedTabs = ADMIN_ROLE_CONFIG[currentRole]?.tabs || [];
  const roleLabel = ADMIN_ROLE_CONFIG[currentRole]?.label || 'Admin';
  const roleColor = ADMIN_ROLE_CONFIG[currentRole]?.color || '#2563eb';

  const groups: NavGroup[] = [
    {
      label: 'Tổng quan',
      items: [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
        { id: 'calendar', label: 'Lịch dạy', icon: <Calendar className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      label: 'Quản lý',
      items: [
        { id: 'classes', label: 'Quản lý lớp', icon: <BookOpen className="w-[18px] h-[18px]" />, badge: pendingClassesCount },
        { id: 'matches', label: 'Ghép lớp', icon: <ExternalLink className="w-[18px] h-[18px]" />, badge: activeMatchesCount },
        { id: 'tutors', label: 'Gia sư', icon: <GraduationCap className="w-[18px] h-[18px]" /> },
        { id: 'students', label: 'Học viên', icon: <Users className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      label: 'Vận hành',
      items: [
        { id: 'registrations', label: 'Đăng ký học', icon: <UserPlus className="w-[18px] h-[18px]" />, badge: pendingRegistrationsCount },
        { id: 'applications', label: 'Đơn ứng tuyển', icon: <ClipboardList className="w-[18px] h-[18px]" />, badge: pendingApplicationsCount },
        { id: 'attendance', label: 'Điểm danh', icon: <ClipboardCheck className="w-[18px] h-[18px]" /> },
        { id: 'contacts', label: 'Liên hệ', icon: <MessageCircle className="w-[18px] h-[18px]" />, badge: unreadContactsCount },
        { id: 'zalonotify', label: 'Tin nhắn Zalo', icon: <Bell className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      label: 'Tài chính & KPI',
      items: [
        { id: 'finance', label: 'Tài chính', icon: <DollarSign className="w-[18px] h-[18px]" /> },
        { id: 'performance', label: 'Hiệu suất gia sư', icon: <Award className="w-[18px] h-[18px]" /> },
        { id: 'kpi', label: 'KPI & Thống kê', icon: <BarChart3 className="w-[18px] h-[18px]" /> },
        { id: 'reviews', label: 'Đánh giá', icon: <Star className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      label: 'Công cụ',
      items: [
        { id: 'activity', label: 'Lịch sử hoạt động', icon: <Activity className="w-[18px] h-[18px]" /> },
        { id: 'import', label: 'Nhập dữ liệu', icon: <Upload className="w-[18px] h-[18px]" /> },
        { id: 'blog', label: 'Blog & SEO', icon: <FileText className="w-[18px] h-[18px]" /> },
        { id: 'advanced', label: 'Nâng cao', icon: <Wrench className="w-[18px] h-[18px]" /> },
        { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-[18px] h-[18px]" /> },
      ],
    },
  ];

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const totalBadge = pendingClassesCount + pendingApplicationsCount + unreadContactsCount + pendingRegistrationsCount;

  const sidebarContent = (
    <>
      {/* Logo & Brand */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 text-sm">
          TĐ
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold tracking-tight text-white leading-tight">Gia Sư Thành Đạt</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-0.5 opacity-80" style={{ color: roleColor }}>{roleLabel}</div>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto admin-scroll">
        {groups.map((group) => {
          const filteredItems = group.items.filter(i => allowedTabs.includes(i.id));
          if (filteredItems.length === 0) return null;
          const isCollapsed = collapsed[group.label];
          const groupHasBadge = filteredItems.some(i => i.badge && i.badge > 0);
          const groupHasActive = filteredItems.some(i => activeTab === i.id);
          return (
            <div key={group.label}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] cursor-pointer rounded-lg transition-colors mb-1 ${groupHasActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="flex items-center gap-1.5">
                  {group.label}
                  {groupHasBadge && isCollapsed && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Group items */}
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                        className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 font-semibold sidebar-active'
                            : 'hover:bg-white/[0.06] text-slate-400 font-medium hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.icon}</span>
                          <span className="text-[13px] leading-tight">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full min-w-[22px] text-center ${
                            isActive ? 'bg-blue-500 text-white' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-2.5 border-t border-white/[0.06]">
        <button
          onClick={() => { window.open('/', '_blank'); setMobileOpen(false); }}
          className="w-full px-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-[13px] font-medium text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Xem trang công khai</span>
        </button>

        <div className="bg-white/[0.04] p-3 rounded-xl text-xs border border-white/[0.06]">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-[11px]">Hệ thống</span>
            <span className="text-green-400 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online
            </span>
          </div>
          <div className="text-[10px] text-slate-600 mt-1">Firebase Realtime Sync</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-[#0F172A] text-white rounded-xl shadow-lg cursor-pointer border border-white/10"
      >
        <Menu className="w-5 h-5" />
        {totalBadge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">{totalBadge > 9 ? '9+' : totalBadge}</span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0F172A] text-slate-300 flex-col h-full shrink-0 border-r border-slate-800/80">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 flex flex-col h-full transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};
